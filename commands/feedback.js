const Discord = require('discord.js')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  if (!args[0])
    return msg.channel.send(`**Usage: \`${prefix}feedback [feedback]\`**`)
  let feedback = args.join(' ')
  if (feedback.length < 8)
    return msg.channel.send(
      `**Error:** Feedback has to be at least 8 characters`
    )

  let gID = '297191838983520257'
  let cID = '335540223884656640'

  let channel = bot.guilds.get(gID).channels.get(cID)

  let author = `${msg.author.username}#${msg.author.discriminator} | ${
    msg.author.id
  }`
  let guild = `${msg.guild.name} | ${msg.guild.id}`

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setAuthor(author, msg.author.displayAvatarURL)
    .addField('Feedback', feedback)
    .addField('Server', guild)
    .setTimestamp()

  channel.send(embed).catch(e => msg.channel.send('**Error:**' + e.message))
  msg.react('335548356552294410')
}

module.exports.help = {
  name: 'feedback',
  desc: 'Leave some feedback or complain about how shit Null is',
  usage: `feedback [feedback]`,
  category: 'Bot',
  aliases: ['complain']
}
