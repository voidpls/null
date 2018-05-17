const Discord = require('discord.js')
const superagent = require('superagent')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let {body} = await superagent
    .get(`https://random.dog/woof.json`)

  while (body.url.slice(-3) === 'mp4') {
    let {body} = await superagent
      .get(`https://random.dog/woof.json`)
  }

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('🐶 Random Dog')
    .setImage(body.url)
    .setFooter('Source: random.dog')

  msg.channel.send(embed)
}

module.exports.help = {
  name: 'dog',
  desc: 'Posts a random dog',
  usage: 'dog',
  category: 'Fun',
  aliases: ['randomdog']
}
