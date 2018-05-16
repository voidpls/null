const Discord = require('discord.js')
const util = require('../utils/util.js')

module.exports.run = async (bot, msg, args, prefix) => {
  let user = util.getUser(bot, msg, args)
  if (user) msg.channel.send(`Here is **${user.username}**'s avatar: \n` + user.displayAvatarURL)
  else msg.channel.send(`Could not find user **${args[0]}**. Please mention the user.`)
}

module.exports.help = {
  name: 'avatar',
  desc: "Gets a user's avatar",
  usage: 'avatar [user]',
  category: 'Info',
  aliases: ['pfp']
}
