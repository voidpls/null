const Discord = require('discord.js')
const config = require('../../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let members = msg.guild.members

  let staff = members.filter(m => m.hasPermission('MANAGE_ROLES', false, true, true))
  let online = staff
    .filter(m => m.presence.status !== 'offline' && !m.user.bot)
    .map(m => m.user.toString())
  let offline = staff
    .filter(m => m.presence.status === 'offline' && !m.user.bot)
    .map(m => `**${m.user.username}#${m.user.discriminator}**`)

  let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setDescription(
      `List of **${msg.guild.name}** Staff:\n` +
        `<:online:438877428807368705> ${online.join(' | ')}\n` +
        `<:offline:438877460373831681> ${offline.join(' | ')}`
    )
    .setFooter(`Requested by ${msg.author.username}`)
    .setTimestamp()

  msg.channel.send(embed).catch(e => msg.channel.send('**Error:** ' + e.message))
}

module.exports.help = {
  name: 'staff',
  desc: "View the server's staff members",
  usage: `staff`,
  category: 'Info',
  aliases: ['mods']
}
