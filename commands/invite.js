module.exports.run = async (bot, msg, args, prefix) => {
  let message = `**Want to add me to your server?** \nHere's my invite link, ${msg.author.toString()}:\n**:link: https://voidxd.me/null/ :link:**`

  msg.channel
    .send(message)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'invite',
  desc: 'Sends the invite for this bot',
  usage: 'invite',
  category: 'Bot',
  aliases: []
}
