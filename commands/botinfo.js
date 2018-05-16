const Discord = require('discord.js')
const config = require('../config/config.json')
const util = require('../utils/util.js')
var pidusage = require('pidusage')

module.exports.run = async (bot, msg, args, prefix) => {
  let nodeVersion = process.version
  let djsPkg = require(`discord.js/package.json`)
  let botMember = msg.guild.member(bot.user)
  let mainacc = bot.users.get(config.mainacc)
  let uptime = util.secsToHMS(Math.floor(process.uptime()))

  let embed = new Discord.RichEmbed()
    .setAuthor('Bot Info', 'http://i.imgur.com/2x6vqOb.png')
    .setColor(botMember.displayHexColor)
    .addField('Servers', `**${bot.guilds.size}**`, true)
    .addField('Users', `**${bot.users.size}**`, true)

  pidusage(process.pid, (err, stats) => {
    embed.addField('CPU Usage', `**${Math.round(stats.cpu * 10) / 10}**%`, true)
      .addField('Memory Usage', `**${Math.round(process.memoryUsage().rss / 100000) / 10}**MB`, true)
      .addField('Uptime', `${uptime}`, true)
      .addField('**Node.js**', `[**${nodeVersion}**](https://nodejs.org/)`, true)
      .addField('**Discord.js**', `[**v${djsPkg.version}**](https://discord.js.org/#/)`, true)
      .addField('Bot Owner', `${mainacc.username}#${mainacc.discriminator}`, true)
      .addField('Invite', `[here](${config.invite})`, true)
    msg.channel.send(embed)
  })
}

module.exports.help = {
  name: 'botinfo',
  desc: 'Shows bot info',
  usage: 'botinfo',
  category: 'Info',
  aliases: ['stats']
}
