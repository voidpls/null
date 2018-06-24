const mongoose = require('mongoose')
const Prefix = mongoose.model('Prefix')
const errors = require('../utils/errors.js')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  if (
    !msg.member.hasPermission('ADMINISTRATOR') &&
    msg.author.id !== config.mainacc
  ) {
    return errors.noPerms(msg, 'Administrator')
  }

  if (!args[0]) {
    let text = `My current prefix is **${prefix}** \n\n**Usage:** \`${prefix}prefix [new prefix]\``
    return msg.channel.send(text)
  }

  let dbPrefix = await Prefix.findById(msg.guild.id)

  if (dbPrefix) {
    dbPrefix
      .update({ prefix: args[0] })
      .then(() => {
        let text = `<:check:335544753443831810> Prefix has been updated to **${
          args[0]
        }**`
        msg.channel.send(text)
      })
      .catch(e => msg.channel.send('**Error: ** Prefix failed to update.'))
  } else {
    const newPre = new Prefix({ _id: msg.guild.id, prefix: args[0] })
    newPre
      .save()
      .then(() => {
        let text = `<:check:335544753443831810> Prefix has been updated to **${
          args[0]
        }**`
        msg.channel.send(text)
      })
      .catch(e => msg.channel.send('**Error: ** Prefix failed to update.'))
  }
}

module.exports.help = {
  name: 'prefix',
  desc: "Change the bot's prefix",
  usage: `prefix [new prefix]`,
  category: 'Bot',
  aliases: []
}
