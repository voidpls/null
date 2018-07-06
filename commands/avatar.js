const util = require('../utils/util.js')

module.exports.run = async (bot, msg, args, prefix) => {
  let user = (await util.getUser(bot, msg, args)) || undefined
  if (user) {
    msg.channel.send(
      `Here is **${user.username}**'s avatar: \n` + user.displayAvatarURL
    )
  } else {
    msg.channel
      .send(`Could not find user **${args[0]}**. Please mention the user.`)
      .catch(e => msg.channel.send('**Error: **' + e.message))
  }
}

module.exports.help = {
  name: 'avatar',
  desc: "Gets a user's avatar",
  usage: 'avatar [user]',
  category: 'Info',
  aliases: ['pfp']
}
