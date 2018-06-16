const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get(`http://inspirobot.me/api?generate=true`)

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setImage(res.data)

  msg.channel
    .send(embed)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'inspirobot',
  desc: 'Generates a random funny quote',
  usage: 'inspirobot',
  category: 'Fun',
  aliases: ['inspiration', 'inspiro']
}
