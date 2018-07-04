module.exports.run = async (bot, msg, args, prefix) => {
  let message = `**☉ Want to add me to your server?**
**☉ https://voidxd.me/null/ **
**☉ Want to join my support server?**
**☉ https://voidxd.me/support/ **`

  msg.channel
    .send(message)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'invite',
  desc: 'Sends my support server and bot invite',
  usage: 'invite',
  category: 'Bot',
  aliases: []
}
