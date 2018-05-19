const Discord = require('discord.js')
const config = require('../config/config.json')

module.exports = async (bot) => {

  bot.on('guildCreate', async guild => {

    console.log('Guild joined')

    console.log(guild.name)

    guild.fetchMembers()

    let gID = '297191838983520257'
    let cID = '447206453749612545'

    let g = bot.guilds.get(gID)
    let channel = g.channels.get(cID)


    let icon = guild.iconURL.replace('jpg', 'png?size=1024')
    /*
    let members = guild.members.filter(m => !m.user.bot).size
    let bots = guild.members.size - members

    let owner = guild.owner.user


    let embed = new Discord.RichEmbed()
    .setColor('#50C878')
    .setTitle(`I've been added to ${guild.name}`)
    .setThumbnail(icon)
    .addField('Members:', members, true)
    .addField('Bots:', bots, true)
    .addField('Owner:', owner.id+owner.discriminator)
    .addField('Server ID:', guild.id)
    .setFooter('Added at: ')
    .setTimestamp()

    channel.send(embed)*/

  })

}
