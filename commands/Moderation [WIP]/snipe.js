const Discord = require('discord.js')
const moment = require('moment')
const sniper = require('../../events/sniper.js')
const util = require('../../utils/util.js')
const config = require('../../config/config.json')
const invRegEx = config.regex.invites

module.exports.run = async (bot, msg, args, prefix) => {
  const userPerms = msg.channel.permissionsFor(msg.member)
  if (!userPerms.has('MANAGE_MESSAGES') && msg.author.id !== config.mainacc) {
    return msg.channel.send(`**Error:** You have insufficient permissions.`).then(m => {
      m.delete(3000)
      msg.delete(3000).catch(e => util.delCatch(e))
    })
  }

  const regex = new RegExp(invRegEx, 'gi')
  const clean = text => {
    if (text.length > 1024) text = text.substr(0, 1021) + '...'
    else if (text.length === 0) text = '[no content]'
    return text.replace(regex, '[redacted]')
  }
  let channel = msg.channel.id

  if (args[0]) {
    const id = args[0].replace(/<|#|>/g, '')
    if (msg.guild.channels.get(id)) channel = id
  }

  const sniped = await sniper.get(channel)
  if (!sniped) {
    return msg.channel
      .send('No recorded message deletes/edits in that channel.')
      .catch(e => util.delCatch(e))
  }
  const embed = new Discord.RichEmbed().setColor(config.colors.white)

  if (sniped instanceof Array) {
    const timeDiff = moment(sniped[1].timestamp).from(moment())
    const user = sniped[1].author
    const tag = `**${user.username}#${user.discrim}** edited a message *${timeDiff}*...`
    embed
      .setAuthor('Message Snipe', user.avatar)
      .setDescription(tag)
      .addField('Before', clean(sniped[0]))
      .addField('After', clean(sniped[1].content))
  } else {
    const attachments = sniped.attachments
    const timeDiff = moment(sniped.timestamp).from(moment())
    const user = sniped.author
    const tag = `**${user.username}#${user.discrim}**'s message was deleted *${timeDiff}*...`
    embed
      .setAuthor('Message Snipe', user.avatar)
      .setDescription(tag)
      .addField('Content', clean(sniped.content))
    if (attachments.length > 0) {
      let attach = attachments.map((a, i) => {
        if (!a) return `**${parseInt(i) + 1}.** Missing File`
        let size = ~~((a.size / 1024) * 10) / 10
        if (!a.type) a.type = '???'
        return `**${parseInt(i) + 1}.** [${a.type}] **${size}**kb - ** [Link](${a.url}) **`
      })
      embed.addField('Attachments', attach.join('\n'))
    }
  }

  msg.channel.send(embed).catch(e => msg.channel.send(`**Error:** ${e.message}`))
}

module.exports.help = {
  name: 'snipe',
  desc:
    'Snipe the last deleted or edited message\n\n' +
    '*Note: Message attachments are only saved (for 24h) if the message is deleted within 3h.*',
  usage: `snipe`,
  category: 'Moderation [WIP]',
  aliases: []
}
