const Discord = require('discord.js')
const config = require('../config/config.json')
const errors = require('../utils/errors.js')

// No missing perm log
module.exports.delCatch = e => {
  let noPermErr = 'Missing Permissions'
  if (e.message === noPermErr) return
  else return console.log(e)
}

// get member function
module.exports.getMember = (msg, args) => {
  let user = msg.guild.member(
    msg.mentions.users.first() || msg.guild.members.get(args[0])
  )

  if (!user) {
    user = msg.guild.members.find(
      m => m.user.username.toLowerCase() === args[0].toLowerCase()
    )
    if (user) return user
    else return undefined
  } else return user
}

// get user function
module.exports.getUser = (bot, msg, args) => {
  let user = false
  if (!args[0]) {
    return msg.author
  } else {
    try {
      user =
        bot.users.get(args[0]) ||
        msg.mentions.users.first() ||
        msg.guild.members.find(
          m => m.user.username.toLowerCase() === args[0].toLowerCase()
        ).user
    } catch (e) {
      if (e) return msg.author
    }
  }
  if (!user) return msg.author
  else return user
}

// get user ANY ARG function
module.exports.getUserFromArg = (bot, msg, arg) => {
  let nameSearch = msg.guild.members.find(
    m => m.user.username.toLowerCase() === arg.toLowerCase()
  )
  if (bot.users.get(arg)) return bot.users.get(arg)
  else if (msg.mentions.users.first()) return msg.mentions.users.first()
  else if (nameSearch) return nameSearch.user
  else return undefined
}

// seconds to hours, mins, seconds
module.exports.secsToHMS = secs => {
  let h = Math.floor(secs / 3600)
  let m = Math.floor((secs % 3600) / 60)
  let s = Math.floor((secs % 3600) % 60)

  let hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hrs, ') : ''
  let mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' mins ') : ''
  let sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' secs') : ''
  return hDisplay + mDisplay + sDisplay
}

// clean
module.exports.clean = text => {
  if (typeof text === 'string') {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
  } else {
    return text
  }
}

// get ordinal
module.exports.ordinal = num => {
  let s = ['th', 'st', 'nd', 'rd']
  let v = num % 100
  return num + (s[(v - 20) % 10] || s[v] || s[0])
}

//commas in num
module.exports.commas = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// get color
module.exports.getColor = async url => {
  const Vibrant = require('node-vibrant')
  let vibrant = new Vibrant(url)
  let palette = await vibrant.getPalette()
  if (palette.Vibrant) return palette.Vibrant.getHex()
  else return config.colors.white
}

// weather search
module.exports.wSearch = (msg, loc) => {
  let weather = require('yahoo-weather')
  weather(loc, 'f')
    .then(info => {
      if (!info) return errors.weather(msg, loc)
      let item = info.item
      let cond = item.condition
      let location = info.location
      let forecast = item.forecast[0]

      let embed = new Discord.RichEmbed()

        .setColor(config.colors.white)
        .setAuthor(`${location.city}, ${location.region}, ${location.country}`)
        .setFooter(info.lastBuildDate.replace(/\w+[.!?]?$/, ''))
        .setDescription(`Search Term: ${loc}`)
        .setThumbnail(`https://voidxd.me/null/weather/${cond.code}.png`)

        .addField(
          '**Temperature:**',
          `**${cond.temp}**°F/**${toC(cond.temp)}**°C`
        )
        .addField(
          '**High/Low:**',
          `**${forecast.high}**°/**${forecast.low}**°F **| ${toC(
            forecast.high
          )}**°/**${toC(forecast.low)}**°C`
        )
        .addField(
          '**Condition**:',
          `${cond.text} | **${info.atmosphere.humidity}**% humidity`
        )

      msg.channel
        .send(embed)
        .catch(e => msg.channel.send('**Error:** ' + e.message))

      function toC(f) {
        return Math.round((f - 32) * 5 / 9)
      }
    })
    .catch(e => errors.weather(msg, loc))
}
