const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get(
    `http://shibe.online/api/shibes?count=[1]&urls=[false]&httpsUrls=[false]`
  )

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('🐾 Random Shibe')
    .setImage(res.data[0])

  msg.channel
    .send(embed)
    .catch(e => msg.channel.send('**Error:** ' + e.message))
}

module.exports.help = {
  name: 'shibe',
  desc: 'Posts a random shibe',
  usage: 'shibe',
  category: 'Animals',
  aliases: ['shiba']
}
