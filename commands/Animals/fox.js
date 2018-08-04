const Discord = require('discord.js')
const axios = require('axios')
const config = require('../../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get(`hhttps://randomfox.ca/floof/`)

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('🦊 Random Fox')
    .setImage(res.data.image)

  msg.channel.send(embed).catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'fox',
  desc: 'Posts a random fox',
  usage: 'fox',
  category: 'Animals',
  aliases: ['randomfox']
}
