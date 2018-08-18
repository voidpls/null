const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')
const errors = require('../utils/errors.js')
const moment = require('moment')
const Vibrant = require('node-vibrant')

// No missing perm log
module.exports.delCatch = e => {
  let noPermErr = 'Missing Permissions'
  if (e.message !== noPermErr) return console.log(e)
}

// get member function
module.exports.getMember = (msg, args) => {
  let user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))

  if (!user) {
    user = msg.guild.members.find(m => m.user.username.toLowerCase() === args[0].toLowerCase())
    if (user) return user
    else return undefined
  } else return user
}

// get user function
module.exports.getUser = async (bot, msg, args) => {
  let user = false
  if (!args[0]) {
    return msg.author
  } else {
    try {
      msg.guild.fetchMembers(args[0])
      user =
        msg.mentions.users.first() ||
        msg.guild.members.find(m =>
          m.user.username.toLowerCase().includes(args[0].toLowerCase())
        ) ||
        (await bot.fetchUser(args[0]))
    } catch (e) {}
  }
  if (!user) return undefined
  else if (user.user) return user.user
  else return user
}

// get user array
module.exports.getUserArr = (bot, msg, arr) => {
  try {
    let resolved = arr.map(i => {
      let id = i.replace(/\D/g, '')
      msg.guild.fetchMembers(i)

      let user = bot.users.get(id) ||
        msg.guild.members.find(m => m.user.username.toLowerCase().includes(i.toLowerCase())) || {
          id: null
        }
      if (user.user) return user.user
      else return user
    })
    return Array.from(new Set(resolved.filter(user => user.id).map(user => user.id)))
  } catch (e) {
    console.log(e)
  }
}

// get user ANY ARG function
module.exports.getUserFromArg = (bot, msg, arg) => {
  let nameSearch = msg.guild.members.find(m => m.user.username.toLowerCase() === arg.toLowerCase())
  if (bot.users.get(arg)) return bot.users.get(arg)
  else if (msg.mentions.users.first()) return msg.mentions.users.first()
  else if (nameSearch) return nameSearch.user
  else return undefined
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

// commas in num
module.exports.commas = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// get color
module.exports.getColor = async url => {
  let vibrant = new Vibrant(url)
  let palette = await vibrant.getPalette()
  if (palette.Vibrant) return palette.Vibrant.getHex()
  else return config.colors.white
}

// is url
module.exports.isURL = async string => {
  const prot = /^(?:\w+:)?\/\/(\S+)$/
  const local = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
  const nonLocal = /^[^\s\.]+\.\S{2,}$/
  if (typeof string !== 'string') return false

  const match = string.match(prot)
  if (!match) return false

  const evAfter = match[1]
  if (!evAfter) return false
  if (local.test(evAfter) || nonLocal.test(evAfter)) return true

  return false
}

// timestamp
module.exports.timestamp = async cmd => {
  const memUsed = Math.round(process.memoryUsage().rss / 1000000)
  const ts = moment().format('M.D.YY h:mm a')
  return console.log(`[${ts}] ${memUsed} MB - ${cmd} ran`)
}
