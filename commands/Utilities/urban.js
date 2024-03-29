const Discord = require('discord.js')
const errors = require('../../utils/errors.js')
const config = require('../../config/config.json')
const urban = require('urban')

module.exports.run = async (bot, msg, args, prefix) => {
  msg.channel.startTyping()
  if (args.length > 0) {
    urban(args.join(' ')).first(json => {
      if (!json) return errors.notFound(msg, args.join(' '))
      if (json.definition.length > 1000) {
        return msg.channel.send(
          `Definition is too long to send. Here's the link: **${json.permalink}**`
        )
      }
      msg.channel.stopTyping(true)
      msg.channel.send(urbanMsg(json, args)).catch(e => msg.channel.send('**Error:** ' + e.message))
    })
  } else {
    urban.random().first(json => {
      if (json.definition.length > 1000) {
        return msg.channel.send(
          `Definition is too long to send. Here's the link: **${json.permalink}**`
        )
      }
      msg.channel.stopTyping(true)
      msg.channel
        .send(urbanMsg(json, ['None']))
        .catch(e => msg.channel.send('**Error:** ' + e.message))
    })
  }

  function urbanMsg(json, args) {
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
