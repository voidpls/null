const Discord = require('discord.js')
const util = require('../utils/util.js')

module.exports = async bot => {
  bot.on('guildDelete', async guild => {
    let gID = '464190709134655500'
    let cID = '464192572458532864'

    await guild.fetchMembers()

    let g = bot.guilds.get(gID)
    let channel = g.channels.get(cID)

    let icon
    if (guild.iconURL !== null) {
      icon = guild.iconURL.replace('jpg', 'png?size=1024')
    } else {
      icon = 'https://voidxd.me/null/images/notfound.png'
    }

    let color = '#ED2939'
    let desc = 'Bot to Member ratio is **'
    let members = await guild.members.filter(m => !m.user.bot).size
    let bots = (await guild.members.size) - members

    let ratio = Math.floor((bots / members) * 100).toFixed(1)
    if (ratio > 75) {
      desc = '**Might be a bot farm!** Bot to Member ratio is **'
    }
    let owner = await guild.owner.user

    let embed = new Discord.RichEmbed()

      .setColor(color)
      .setTitle(`I've been removed from ${guild.name}`)
      .setThumbnail(icon)
      .setDescription(desc + ratio + '%**')
      .addField('Members:', members, true)
      .addField('Bots:', bots, true)
      .addField(
        'Owner:',
        `${owner.username}#${owner.discriminator} | ${owner.id}`
      )
      .addField('Server ID:', guild.id)
      .setFooter(`I am now in ${bot.guilds.size} servers`)
      .setTimestamp()

    channel.send(embed)
    let usercount = bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b)
    bot.user.setActivity(`${util.commas(usercount)} users | >invite`, {
      type: 'PLAYING'
    })
  })
}

module.exports.help = {
  name: 'guildCreate'
}
