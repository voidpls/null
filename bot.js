const Discord = require('discord.js')
const Cron = require('cron').CronJob
const rimraf = require('rimraf')
const axios = require('axios')
const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')
const util = require('./utils/util.js')
const chatbot = require('./utils/chatbot.js')

const config = require('./config/config.json')
const blacklistFile = './config/blacklist.json'

const bot = new Discord.Client({
  disabledEvents: ['TYPING_START', 'MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'],
  messageCacheMaxSize: 150,
  disableEveryone: true
})
bot.commands = new Discord.Collection()
bot.devCommands = new Discord.Collection()
bot.events = new Discord.Collection()

let cooldown = new Set()
let cooldown2 = new Set()
let date = Date.now()

let CDsecs = 2.5

// terminal beautification
console.log('-------------------------------------')
console.log('Module Status:')

function loadModules(dir, name, setAs, botObj) {
  fs.readdir(dir, (err, files) => {
    if (err) console.log(err)

    // remove '.js'
    let jsfiles = files.filter(f => f.endsWith('js'))
    if (jsfiles.length <= 0) {
      return console.log('ERROR: No commands found.')
    }
    let count = 0
    // load modules
    jsfiles.forEach((f, i) => {
      let props = require(dir + f)
      count++
      if (botObj) props(botObj)
      bot[setAs].set(props.help.name.toLowerCase(), props)
    })
    console.log(`→ Loaded ${count} ${name}`)
    // terminal beautification
  })
}

loadModules('./commands/', 'commands', 'commands')
loadModules('./devCmds/', 'dev commands', 'devCommands')
loadModules('./events/', 'events', 'events', bot)

require('./db/models/db.js')
const Prefix = mongoose.model('Prefix')

//catch unhandled rejections
process.on('unhandledRejection', r => console.log(`[${new Date()}]`, r))

// on connect event handler
bot.on('ready', async () => {
  console.log(`→ Successfully connected as ${bot.user.username}`)
  let usercount = bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b)
  console.log(
    `→ Bot is currently in ${bot.guilds.size} server(s) \n→ Bot is serving ${usercount} members`
  )
  // terminal beautification
  console.log('-------------------------------------')

  // set bot status
  bot.user.setActivity(`${util.commas(usercount)} users | >invite`, {
    type: 'PLAYING'
  })
  setTimeout(() => {
    usercount = bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b)
    bot.user.setActivity(`${util.commas(usercount)} users | >invite`, {
      type: 'PLAYING'
    })
  }, 6e5)
  bot.user.setStatus('online')
})

new Cron(
  '0 */30 * * * *',
  () => {
    let snipeDir = path.join(__dirname, `/db/snipes`)
    fs.readdir(snipeDir, (err, files) => {
      //  console.log('files', files.length)
      //  console.log(moment(new Date().getTime()).format('M/D, YYYY h:mm a'))
      files.forEach((file, i) => {
        let filePath = path.join(snipeDir, file)
        fs.stat(filePath, (err, stat) => {
          let now = new Date().getTime()
          let end = new Date(stat.birthtime).getTime() + 10800000
          //  console.log(file, moment(end).format('M/D, YYYY h:mm a'))
          if (now >= end) {
            rimraf(filePath, err => {
              if (err) console.log(err)
              //  else console.log('Deleted file', file)
            })
          }
        })
      })
    })
  },
  null,
  true,
  'America/New_York'
)

// message event handler
bot.on('message', async msg => {
  // ignore bots
  if (msg.author.bot || msg.channel.type === 'dm') return

  /*************************************************/
  /*                   DEV MODE                    */
  // if (msg.guild.id !== '297191838983520257') return
  /*************************************************/

  if (msg.attachments.size > 0) {
    msg.attachments.map(async attach => {
      let ext = attach.filename.slice(((attach.filename.lastIndexOf('.') - 1) >>> 0) + 2)
      axios
        .get(attach.url, {
          responseType: 'stream'
        })
        .then(res => {
          res.data.pipe(fs.createWriteStream(`./db/snipes/${attach.id}.${ext}`))
        })
    })
  }

  // parse blacklist file
  let blacklist = JSON.parse(fs.readFileSync(blacklistFile, 'utf8'))

  // set prefix
  let prefix = await Prefix.findById(msg.guild.id)
  if (!prefix) prefix = config.prefix
  else prefix = prefix.prefix
  let preLen = prefix.length

  let runChatbot = false

  // array of words in the message
  if (msg.content.startsWith(`<@${bot.user.id}>`)) {
    preLen = `<@${bot.user.id}>`.length + 1
    runChatbot = true
    msg.mentions.users.delete(msg.mentions.users.firstKey())
  } else if (msg.content.startsWith(`<@!${bot.user.id}>`)) {
    preLen = `<@!${bot.user.id}>`.length + 1
    runChatbot = true
    msg.mentions.users.delete(msg.mentions.users.firstKey())
  } else if (!msg.content.startsWith(prefix)) return

  /************************************************************/
  /** * Code below this line will ignore messages w/o prefix ***/
  /************************************************************/

  let args = msg.content
    .slice(preLen)
    .split(' ')
    .slice(1)

  // pulls command from message
  let cmd = msg.content
    .slice(preLen)
    .split(' ')[0]
    .toLowerCase()

  // TEMPORARY
  if (cmd === 'nic')
    return msg.channel.send(
      '<:forsen1:364142529207205889><:forsen2:364143062688989187>\n<:forsen3:364143324900229120><:forsen4:364143377400463360>'
    )
  // COMMAND

  if (blacklist[msg.author.id]) return

  let cmdFile = bot.commands.get(cmd)

  if (cmdFile) {
    runChatbot = false
    return runCMD(cmdFile)
  } else if (bot.devCommands.get(cmd) && msg.author.id === config.mainacc) {
    runChatbot = false
    return bot.devCommands.get(cmd).run(bot, msg, args, prefix)
  } else {
    //if alias matches
    bot.commands.forEach(c => {
      if (c.help.aliases.includes(cmd)) {
        runChatbot = false
        return runCMD(c)
      }
    })
  }
  if (runChatbot === true) chatbot(msg, msg.content.slice(preLen).split(' '))

  function runCMD(c) {
    // check if user is in cooldown set
    if (cooldown.has(msg.author.id)) {
      // check if user is in 2nd cooldown set
      if (cooldown2.has(msg.author.id)) {
        return msg.delete(3000).catch(e => util.delCatch(e))
      }
      // add user to 2nd cooldown set
      cooldown2.add(msg.author.id)
      // warn + delete messages
      return msg.channel
        .send(`Please wait **3** seconds between commands, **${msg.author.username}**.`)
        .then(m => {
          m.delete(3000)
          msg.delete(3000).catch(e => util.delCatch(e))
        })
    }

    // add user to 1st cooldown set
    cooldown.add(msg.author.id)
    setTimeout(() => {
      cooldown.delete(msg.author.id)
      cooldown2.delete(msg.author.id)
    }, CDsecs * 1000)
    // run command if not in the cooldown set
    let memUsed = Math.round(process.memoryUsage().rss / 1000000)
    console.log(`[${new Date()}] ${memUsed} MB - ${c.help.name} ran`)
    return c.run(bot, msg, args, prefix)
  }
})

// login with token
bot.login(config.token)
