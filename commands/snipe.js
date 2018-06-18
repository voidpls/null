const Discord = require('discord.js')
const moment = require('moment')
const sniper = require('../events/sniper.js')
const util = require('../utils/util.js')
const config = require('../config/config.json')
const invRegEx = config.regex.invites

module.exports.run = async (bot, msg, args, prefix) => {
  let userPerms = msg.channel.permissionsFor(msg.member)
  if (!userPerms.has('MANAGE_MESSAGES') && msg.author.id !== config.mainacc) {
    return msg.channel
      .send(`**Error:** You have insufficient permissions.`)
      .then(m => {
        m.delete(3000)
        msg.delete(3000).catch(e => util.delCatch(e))
      })
  }

  let regex = new RegExp(invRegEx, 'gi')
  let clean = text => {
    if (text.length > 1024) text = text.substr(0, 1021) + '...'
    else if (text.length === 0) text = '[no content]'
    text.replace(regex, '[redacted]')
    return text
  }
  let sniped = await sniper.get(msg.channel.id)
  if (!sniped) {
    return msg.channel
      .send('No recorded message deletes/edits in this channel.')
      .catch(e => util.delCatch(e))
  }
  let embed = new Discord.RichEmbed().setColor(config.colors.white)
  // .setFooter(
  //   `Requested by ${msg.author.username}#${msg.author.discriminator}`
  // )
  //.setTimestamp()

  if (sniped instanceof Array) {
    let timeDiff = moment(sniped[1].timestamp).from(moment())
    let user = sniped[1].author
    let tag = `**${user.username}#${
      user.discrim
    }** edited a message *${timeDiff}*...`
    embed
      .setAuthor('Message Snipe', user.avatar)
      .setDescription(tag)
      .addField('Before', clean(sniped[0]))
      .addField('After', clean(sniped[1].content))
  } else {
    let attachments = sniped.attachments
    let timeDiff = moment(sniped.timestamp).from(moment())
    let user = sniped.author
    let tag = `**${user.username}#${
      user.discrim
    }** deleted a message *${timeDiff}*...`
    embed
      .setAuthor('Message Snipe', user.avatar)
      .setDescription(tag)
      .addField('Content', clean(sniped.content))
    if (attachments.length > 0) {
      let attach = attachments.map((a, i) => {
        if (!a) return `**${parseInt(i) + 1}.** Missing File`
        let size = ~~(a.size / 1024 * 10) / 10
        if (!a.type) a.type = '???'
        return `**${parseInt(i) + 1}.** [${a.type}] **${size}**kb - ** [Link](${
          a.url
        }) **`
      })
      embed.addField('Attachments', attach.join('\n'))
    }
  }

  msg.channel
    .send(embed)
    .catch(e => msg.channel.send(`**Error:** ${e.message}`))
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
