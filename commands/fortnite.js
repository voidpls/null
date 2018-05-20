const Discord = require('discord.js')
const config = require('../config/config.json')
const errors = require('../utils/errors.js')
const Fortnite = require('fortnite')
const ftAPI = new Fortnite(config.api_keys.fortnite)

module.exports.run = async (bot, msg, args, prefix) => {
  if (!args[0]) return errors.specifyUser(msg, prefix)

  let platforms = {
    computer: 'pc',
    pc: 'pc',
    xbox: 'xbl',
    xbl: 'xbl',
    playstation: 'psn',
    psn: 'psn'
  }
  let lastarg = args[args.length - 1].toLowerCase()
  let username
  let platform = 'pc'
  if (platforms[lastarg]) {
    args.pop()
    username = args.join(' ')
    platform = platforms[lastarg]
  } else {
    username = args.join(' ')
  }

  ftAPI
    .getInfo(username, platform)
    .then(data => {
      let stats = data.lifetimeStats
      let wins = fstat(stats, 'wins')
      let winPercent = fstat(stats, 'win')
      let top3 = parseInt(fstat(stats, 'top3s')) + parseInt(wins)
      let kills = fstat(stats, 'kills')
      let KD = fstat(stats, 'kd')
      let mPlayed = fstat(stats, 'matchesPlayed')

      let embed = new Discord.RichEmbed()
        .setColor(config.colors.white)
        .setTitle('Fortnite Stats')
        .setAuthor(
          data.platform.toUpperCase() + ' | ' + data.username,
          'https://i.imgur.com/imPQal4.png'
        )
        .setThumbnail('https://i.imgur.com/da8iJVl.png')
        .setFooter('Stats from FortniteTracker.com')

        .addField('Wins', wins, true)
        .addField('Win %', winPercent, true)
        .addField("Top 3's", top3, true)
        .addField('Matches Played', mPlayed, true)
        .addField('Kills', kills, true)
        .addField('K/D', KD, true)

      msg.channel.send(embed).catch(e => msg.channel.send(e.error))
    })
    .catch(e => {
      console.log(e)
      msg.channel
        .send(
          `**Error:** Player **${username}** on **${platform.toUpperCase()}** not found`
        )
        .then(m => m.delete(5000))
    })

  function fstat(stats, str) {
    return stats.find(s => s.stat === str).value
  }
}

module.exports.help = {
  name: 'fortnite',
  desc: 'Check Fortnite stats',
  usage: 'fortnite [username] [pc, xbl, psn]',
  category: 'Utilities',
  aliases: ['ftn', 'ft']
}
