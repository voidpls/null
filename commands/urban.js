const Discord = require('discord.js')
const errors = require('../utils/errors.js')
const config = require('../config/config.json')
const urban = require('urban')

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length > 0) {
    urban(args.join(' ')).first(json => {
      if (!json) return errors.notFound(msg, args.join(' '))
      if (json.definition.length > 1024) return msg.channel.send(`Definition is too long to send. Here's the link: **${json.permalink}**`)
      msg.channel.send(urbanMsg(json, args))
    })
  } else {
    urban.random().first(json => {
      if (json.definition.length > 1024) return msg.channel.send(`Definition is too long to send. Here's the link: **${json.permalink}**`)
      msg.channel.send(urbanMsg(json, ['None']))
    })
  }

  function urbanMsg (json, args) {
    let embed = new Discord.RichEmbed()
      .setAuthor(json.word, 'http://voidxd.me/null/images/urban.jpg')
      .setColor(config.colors.white)
      .setDescription(`Search term: ${args.join(' ')}`)
      .addField('**Definition:**', json.definition)
      .addField('**Example:**', json.example)
      .addField('**Rating:**', `**👍 ${json.thumbs_up} 👎 ${json.thumbs_down}**`)
      .setFooter('Author: ' + json.author)

    return embed
  }
}

module.exports.help = {
  name: 'urban',
  desc: 'Find a word on Urban Dictionary. Random word if no term is given.',
  usage: 'urban [term]',
  category: 'Utilities',
  aliases: ['ud']
}
