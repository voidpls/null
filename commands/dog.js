const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get(`https://random.dog/woof.json`)

  while (res.data.url.endsWith('.mp4')) {
    res = await axios.get(`https://random.dog/woof.json`)
  }

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('🐶 Random Dog')
    .setImage(res.data.url)

  msg.channel
    .send(embed)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'dog',
  desc: 'Posts a random dog',
  usage: 'dog',
  category: 'Animals',
  aliases: ['randomdog']
}
