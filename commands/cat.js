const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get(`https://thecatapi.com/api/images/get`)

  let url = res.headers.original_image

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('🐱 Random Cat')
    .setImage(url)

  msg.channel
    .send(embed)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'cat',
  desc: 'Posts a random cat',
  usage: 'cat',
  category: 'Animals',
  aliases: ['randomcat']
}
