const fs = require('fs')
const errors = require('../utils/errors.js')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  if (
    !msg.member.hasPermission('ADMINISTRATOR') &&
    msg.author.id !== config.mainacc
  ) { return errors.noPerms(msg, 'Administrator') }

  let prefixes = JSON.parse(fs.readFileSync('./config/prefix.json', 'utf8'))

  if (!args[0]) {
    return msg.channel.send(
      `My current prefix is **${prefix}** \n\n**Usage:** \`${prefix}prefix [new prefix]\``
    )
  }
  prefixes[msg.guild.id] = args[0]

  fs.writeFile(
    './config/prefix.json',
    JSON.stringify(prefixes, null, '\t'),
    err => {
      if (err) console.log(err)
    }
  )

  msg.channel
    .send(
      `<:check:335544753443831810> Prefix has been updated to **${args[0]}**`
    )
    .catch(e => msg.channel.send('**Error:** ' + e.message))
}

module.exports.help = {
  name: 'prefix',
  desc: "Change the bot's prefix",
  usage: `prefix [new prefix]`,
  category: 'Bot',
  aliases: []
}
