const Discord = require('discord.js')
const config = require('../config/config.json')
const language = require('../config/language.json')
const translate = require('google-translate-api')

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length < 2)
    return msg.channel.send(
      `**Usage: \`${prefix}translate [language] [text]\`**`
    )

  let toLang = args.shift().toLowerCase()
  if (toLang.length === 2) {
    toLang = language.find(obj => obj.code === toLang).name.split(/;|,/)[0]
  } else {
    toLang = toLang.charAt(0).toUpperCase() + toLang.substr(1).toLowerCase()
  }

  let text = args.join(' ')

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setAuthor(
      'Google Translate',
      'https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png'
    )

  translate(text, { to: toLang })
    .then(json => {
      let fromLangISO = json.from.language.iso.toLowerCase()
      let fromLang = language.find(obj => obj.code === fromLangISO).name
      fromLang = fromLang.split(/;|,/)[0]

      embed.setDescription(`**${fromLang}** to **${toLang}**:\n${json.text}`)
      msg.channel
        .send(embed)
        .catch(e => msg.channel.send(`**Error:** ${e.message}`))
    })
    .catch(e => msg.channel.send(`**Error:** ${e.message}`))
}

module.exports.help = {
  name: 'translate',
  desc: 'Translate text to another language',
  usage: 'translate [language] [text]',
  category: 'Utilities',
  aliases: ['tr']
}
