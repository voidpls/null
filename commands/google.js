const Discord = require('discord.js')
const config = require('../config/config.json')
const google = require('google')

google.resultsPerPage = 10

google.lang = 'en'
google.tld = 'com'

module.exports.run = async (bot, msg, args, prefix) => {
  if (!args[0]) { return msg.channel.send('**Error:** Please specify a search query!') }

  let query = args.join(' ')

  let embed = new Discord.RichEmbed()
    .setAuthor('Google Search', 'https://i.imgur.com/RU7KojF.png')
    .setColor(config.colors.white)
    .setDescription(`Search results for: **${query}**`)

  google(query, function (err, res) {
    if (err) return msg.channel.send('**Error:** ' + err.error)
    let count = 0
    let count2 = 0

    while (count2 < 3) {
      let link = res.links[count]
      if (link && link.link) {
        count2++
        embed.addField(link.title, `**${link.link}**`)
      }
      if (count >= 6) { return msg.channel.send(`**Error:** No results found for **${query}**`) }
      count++
    }

    let url = res.url
      .split('&')
      .splice(0, 2)
      .join('&')
      .slice(8)
    embed.setFooter(url)

    msg.channel
      .send(embed)
      .catch(e => msg.channel.send('**Error:** ' + e.error))
  })
}

module.exports.help = {
  name: 'google',
  desc: "Google's a search query",
  usage: 'google [query]',
  category: 'Utilities',
  aliases: ['g', 'search']
}
