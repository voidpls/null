const Discord = require('discord.js')

module.exports = async (bot) => {
  bot.on('guildCreate', async guild => {

    let gID = '297191838983520257'
    let cID = '447206453749612545'

    await guild.fetchMembers()

    let g = bot.guilds.get(gID)
    let channel = g.channels.get(cID)

    let icon
    if (guild.iconURL !== null) {
      icon = guild.iconURL.replace('jpg', 'png?size=1024')
    } else {
      icon = 'https://voidxd.me/null/images/notfound.png'
    }

    let color = '#50C878'
    let desc = 'Bot to Member ratio is **'
    let members = await guild.members.filter(m => !m.user.bot).size
    let bots = await guild.members.size - members

    let ratio = Math.floor((bots / members)*100).toFixed(1)
    if (ratio > 75) {
      desc = '**Might be a bot farm!** Bot to Member ratio is **'
      color = '#ffcf3f'
    }
    let owner = await guild.owner.user

    let embed = new Discord.RichEmbed()

      .setColor(color)
      .setTitle(`I've been added to ${guild.name}`)
      .setThumbnail(icon)
      .setDescription(desc + ratio + '%**')
      .addField('Members:', members, true)
      .addField('Bots:', bots, true)
      .addField('Owner:', `${owner.username}#${owner.discriminator} | ${owner.id}`)
      .addField('Server ID:', guild.id)
      .setFooter(`I am now in ${bot.guilds.size} servers`)
      .setTimestamp()

    channel.send(embed)
  })
}
