const Discord = require('discord.js')
const fs = require('fs')
const util = require('./utils/util.js')

const config = require('./config/config.json')
const prefixFile = './config/prefix.json'
const blacklistFile = './config/blacklist.json'

const bot = new Discord.Client({
  disabledEvents: [
    'TYPING_START',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE'
  ],
  messageCacheMaxSize: 150,
  disableEveryone: true
})
bot.commands = new Discord.Collection()
bot.devCommands = new Discord.Collection()

let cooldown = new Set()
let cooldown2 = new Set()

let CDsecs = 2.5

// terminal beautification
console.log('-------------------------------------')

// check command files
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err)

  // remove '.js'
  let jsfiles = files.filter(f => f.endsWith('js'))
  if (jsfiles.length <= 0) {
    return console.log('ERROR: No commands found.')
  }
  console.log('→ Module Status: \n-------------------------------------')
  // load modules
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`)
    console.log(`√ ${f.slice(0, -3)} loaded successfully`)
    bot.commands.set(props.help.name.toLowerCase(), props)
  })
  // terminal beautification
  console.log('-------------------------------------')
})

// check dev command files
fs.readdir('./devCmds/', (err, files) => {
  if (err) console.log(err)

  // remove '.js'
  let jsfiles = files.filter(f => f.endsWith('js'))
  if (jsfiles.length <= 0) {
    return console.log('ERROR: No dev commands found.')
  }
  console.log('→ Dev Module Status: \n-------------------------------------')
  // load modules
  jsfiles.forEach((f, i) => {
    let props = require(`./devCmds/${f}`)
    console.log(`√ ${f.slice(0, -3)} loaded successfully`)
    bot.devCommands.set(props.help.name, props)
  })
  // terminal beautification
  console.log('-------------------------------------')
})

//check event files
fs.readdir('./events/', (err, files) => {
  if (err) console.log(err)

  // remove '.js'
  let jsfiles = files.filter(f => f.endsWith('js'))
  if (jsfiles.length <= 0) {
    return console.log('ERROR: No events found.')
  }
  console.log('→ Events Status: \n-------------------------------------')
  // load modules
  jsfiles.forEach((f, i) => {
    let ev = require(`./events/${f}`)
    console.log(`√ ${f.slice(0, -3)} loaded successfully`)
    ev(bot)
  })
  // terminal beautification
  console.log('-------------------------------------')
})

// on connect event handler
bot.on('ready', async () => {
  console.log(`→ Successfully connected as ${bot.user.username}`)
  // terminal beautification
  console.log('-------------------------------------')
  console.log(
    `→ Bot is currently in ${bot.guilds.size} server(s) \n→ Bot is serving ${
      bot.users.size
    } members`
  )

  // set bot status
  bot.user.setActivity(`${bot.guilds.size} servers | >help`, {
    type: 'PLAYING'
  })
  bot.user.setStatus('online')

  // terminal beautification
  console.log('-------------------------------------')
})

// message event handler
bot.on('message', async msg => {
  // ignore bots
  if (msg.author.bot || msg.channel.type === 'dm') return

  /*************************************************/
  /*                   DEV MODE                    */
  // if (msg.guild.id !== '297191838983520257') return
  /*************************************************/

  // parse prefix file
  let prefixes = JSON.parse(fs.readFileSync(prefixFile, 'utf8'))

  let blacklist = JSON.parse(fs.readFileSync(blacklistFile, 'utf8'))

  // set prefix
  let prefix = prefixes[msg.guild.id] || config.prefix
  let preLen = prefix.length

  // array of words in the message

  if (msg.content.startsWith(`<@${bot.user.id}>`))
    preLen = `<@${bot.user.id}>`.length + 1
  else if (msg.content.startsWith(`<@!${bot.user.id}>`))
    preLen = `<@!${bot.user.id}>`.length + 1
  else if (!msg.content.startsWith(prefix)) return

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

  if (cmdFile) return runCMD(cmdFile)
  else if (bot.devCommands.get(cmd) && msg.author.id === config.mainacc)
    return bot.devCommands.get(cmd).run(bot, msg, args, prefix)
  else {
    //if alias matches
    bot.commands.forEach(c => {
      if (c.help.aliases.includes(cmd)) return runCMD(c)
    })
  }

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
        .send(
          `Please wait **3** seconds between commands, **${
            msg.author.username
          }**.`
        )
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
    console.log(`${memUsed} MB - ${c.help.name} ran`)
    return c.run(bot, msg, args, prefix)
  }
})

// login with token
bot.login(config.token)
