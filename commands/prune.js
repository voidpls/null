const Discord = require('discord.js')
const util = require('../utils/util.js')
let pruneNum = 50

module.exports.run = async (bot, msg, args, prefix) => {
  let botMem = msg.guild.member(bot.user)
  let botPerms = msg.channel.permissionsFor(botMem)
  let userPerms = msg.channel.permissionsFor(msg.member)
  if (!botPerms.has('MANAGE_MESSAGES'))
    return msg.channel
      .send(`**Error:** I'm missing the **\`Manage Messages\`** permission!`)
      .catch(e => console.log(e))
  if (!userPerms.has('MANAGE_MESSAGES'))
    return msg.channel
      .send(`**Error:** You have insufficient permissions.`)
      .catch(e => console.log(e))

  // prune 50
  if (!args[0]) {
    console.log('prune 50')
    //msg.delete().catch(e => util.delCatch(e))
    let msgs = await msg.channel.fetchMessages({ limit: 75 })
    msgs = msgs.filter(m => !m.pinned).array()
    if (msgs.length > pruneNum) msgs.length = pruneNum
    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
    return
  }
  let param = args[0].toLowerCase()

  //prune images

  if (['images', 'image', 'pics', 'img', 'imgs'].includes(param)) {
    console.log('prune images')
    msg.delete().catch(e => util.delCatch(e))
    if (parseInt(args[1]) && parseInt(args[1]) > 0) pruneNum = parseInt(args[1])
    let msgs = await msg.channel.fetchMessages({ limit: 100 })
    msgs = msgs
      .filter(m => !m.pinned)
      .filter(
        m =>
          m.attachments.size !== 0 ||
          m.embeds.some(e => e.type === 'image' || e.image)
      )
    if (msgs.length > pruneNum) msgs.length = pruneNum
    if (msgs.length === 0) return
    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
  } else if (['bots', 'bot'].includes(param)) {
    //prune bots

    console.log('prune bots')
    msg.delete().catch(e => util.delCatch(e))
    if (parseInt(args[1]) && parseInt(args[1]) > 0) pruneNum = parseInt(args[1])
    let msgs = await msg.channel.fetchMessages({ limit: 100 })
    msgs = msgs.filter(m => !m.pinned && m.author.bot).array()
    if (msgs.length > pruneNum) msgs.length = pruneNum
    if (msgs.length === 0) return
    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
  } else if (['with', 'includes', 'w'].includes(param)) {
    //prune with

    console.log('prune with')
    msg.delete().catch(e => util.delCatch(e))
    let msgs = await msg.channel.fetchMessages({ limit: 100 })

    let matchTxt = args
      .slice(1)
      .join(' ')
      .toLowerCase()
    msgs = msgs
      .filter(m => !m.pinned && m.content.toLowerCase().includes(matchTxt))
      .array()

    if (msgs.length === 0) return
    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
  } else if (isNaN(parseInt(param)) || param.length > 4) {
    //prune user
    console.log('prune user')
    msg.delete().catch(e => util.delCatch(e))
    let userIDs = util.getUserArr(bot, msg, args)
    if (userIDs.length === 0)
      return msg.channel
        .send(`**Error:** Specify a valid prune parameter`)
        .catch(e => util.delCatch(e))
        .then(m => m.delete(5000).catch(e => util.delCatch(e)))

    let msgs = await msg.channel.fetchMessages({ limit: 100 })
    msgs = msgs.filter(m => !m.pinned && userIDs.includes(m.author.id)).array()
    if (msgs.length === 0) return
    msg.channel
      .send(
        `Deleting **${msgs.length}** messages from **${
          userIDs.length
        }** user(s)`
      )
      .then(m => m.delete(3000).catch(e => util.delCatch(e)))
      .catch(e => util.delCatch(e))

    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
  } else {
    //prune #

    console.log('prune #')
    // msg.delete().catch(e => util.delCatch(e))
    if (parseInt(param) > 100)
      return msg.channel
        .send(`**Error:** Max prunable messages at once is 100`)
        .then(m => m.delete(3000).catch(e => util.delCatch(e)))
        .catch(e => util.delCatch(e))
    let msgs = await msg.channel.fetchMessages({ limit: 100 })
    param = parseInt(param) + 1
    pruneNum = valBetween(param, 0, 100)
    msgs = msgs.filter(m => !m.pinned).array()
    if (msgs.length > pruneNum) msgs.length = pruneNum
    if (msgs.length === 0) return
    msg.channel
      .bulkDelete(msgs, true)
      .catch(e => msg.channel.send(e.message).catch(e => util.delCatch(e)))
  }
}

let valBetween = (v, min, max) => {
  return Math.min(max, Math.max(min, v))
}

module.exports.help = {
  name: 'prune',
  desc: 'Prune messages',
  usage: `prune [bots | images | with | user | #]`,
  category: 'Moderation [WIP]',
  aliases: ['purge', 'clear', 'clr']
}
