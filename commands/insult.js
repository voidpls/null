const Discord = require('discord.js')
const superagent = require('superagent')
const config = require('../config/config.json')
const util = require('../utils/util.js')
const axios = require('axios');


module.exports.run = async (bot, msg, args, prefix) => {

  let query = '?'
  if (args[0]) {
    let user = util.getUserFromArg(bot, msg, args[0])

    if (user) {
      query = `${query}who="**${user.username}**"`
    } else {
      query = `${query}who="**${args.join(' ')}**"`
    }
  }

  let res = await axios.get(`https://insult.mattbas.org/api/insult.json${query}`)

  let insult = res.data.insult.replace(/["]/g, '')

  msg.channel.send(insult).catch(e => msg.channel.send(e.error))

}

module.exports.help = {
  name: 'insult',
  desc: "Get an insult or insult a user",
  usage: `insult [who]`,
  category: 'Fun',
  aliases: []

}