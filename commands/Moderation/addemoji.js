const Discord = require('discord.js')
const util = require('../../utils/util.js')
const path = require('path')

module.exports.run = async (bot, msg, args, prefix) => {
  if (!msg.member.permissions.has('MANAGE_EMOJIS'))
    return msg.channel.send(`**Error:** You have insufficient permissions.`)
  if (!msg.guild.me.permissions.has('MANAGE_EMOJIS'))
    return msg.channel.send(`**Error:** I am missing the \`Manage Emojis\` permission`)

  const name = args[0]
  const url = await getEmote(msg, args)
  if (!name || !url)
    return msg.channel.send(`**Usage:** \`${prefix}addemote [name] [url/emote/image]\``)

  const reason = `Requested by ${msg.author.username}#${msg.author.discriminator}`
  msg.guild
    .createEmoji(url, name, null, reason)
    .then(e => msg.channel.send(`**Success:** Emoji \`:${e.name}:\` created [${e.toString()}]`))
    .catch(e => msg.channel.send(`**Error:** ${e.message}`))
}

async function getEmote(msg, args) {
  if (msg.attachments.first()) return msg.attachments.first().url
  if (!args[1]) return null
  if (await util.isURL(args[1])) return args[1]
  const match = args[1].match(/<(a)?:.*:(\d*)>/i)
  if (match[2]) {
    if (match[1] === 'a') return `https://cdn.discordapp.com/emojis/${match[2]}.gif`
    else return `https://cdn.discordapp.com/emojis/${match[2]}.png`
  }
  return null
}

module.exports.help = {
  name: 'AddEmoji',
  desc: 'Add an emote',
  usage: `addemote [name] [url/emote/image]`,
  category: 'Moderation',
  aliases: ['addemote']
}
