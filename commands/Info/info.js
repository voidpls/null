const Discord = require('discord.js')
const config = require('../../config/config.json')
const util = require('../../utils/util.js')
const moment = require('moment')

module.exports.run = async (bot, msg, args, prefix) => {
  let user = (await util.getUser(bot, msg, args)) || undefined
  if (!user) {
    return msg.channel.send(`**Error:** Could not find user info for **${args.join()}**`)
  }
  let avatar = user.displayAvatarURL
  let color = config.colors.white
  let joinTime = 'N/A'
  let topRole = 'N/A'
  let accType = 'User'
  let nick = 'N/A'
  let joinPos = 'N/A'
  let status = user.presence.status
  let serverCt = bot.guilds.filter(g => g.members.get(user.id)).size
  let roles = 'N/A'

  let statusMap = {
    offline: '<:offline:313956277237710868> Offline',
    idle: '<:idle:438877481831890944> Idle',
    dnd: '<:dnd:438877374726144001> DND',
    online: '<:online:438877428807368705> Online'
  }

  function format(timestamp) {
    return moment.unix(timestamp / 1000).format('MMMM Do, YYYY hh:mma')
  }

  if (user.bot) {
    accType = 'Bot'
  }

  if (msg.guild.member(user)) {
    let member = msg.guild.member(user)
    color = member.displayHexColor
    joinTime = format(member.joinedTimestamp)
    topRole = member.highestRole.name
    roles = member.roles.size - 1

    let sortedArr = member.guild.members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
    let sortedUsernames = sortedArr.map(m => m.user.id)
    joinPos = util.ordinal(sortedUsernames.indexOf(member.id) + 1)

    if (member.nickname) {
      nick = member.nickname
    }
  }

  let desc =
    `☉ Account Type: **${accType}**\n` +
    `☉ User ID: **${user.id}**\n` +
    `☉ Status: **${statusMap[status]}**\n` +
    `☉ Shared Servers: **${serverCt}**\n` +
    `☉ Nickname: **${nick}**\n` +
    `☉ Roles: **${roles}** [Top - **${topRole}**]\n` +
    `☉ Join Position: **${joinPos}**\n` +
    `☉ Server Join: **${joinTime}**\n` +
    `☉ Account Created: **${format(user.createdTimestamp)}**`

  let text = `🔎 User Info for **${user.username}#${user.discriminator}**:`
  let botMem = msg.guild.member(bot.user)
  let botPerms = msg.channel.permissionsFor(botMem)

  let embed = new Discord.RichEmbed()
    .setColor(color)
    .setThumbnail(avatar)

    .setDescription(desc)

  if (!botPerms.has('EMBED_LINKS')) {
    text = desc
  }

  msg.channel.send(text, embed).catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'info',
  desc: 'Shows user info',
  usage: 'info [user]',
  category: 'Info',
  aliases: ['userinfo', 'user', 'whois']
}
