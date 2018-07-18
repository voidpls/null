module.exports.run = async (bot, msg, args, prefix) => {
  await msg.channel.send(':ping_pong:  |  Pong! - Time taken:').then(m => {
    const diff = m.createdTimestamp - msg.createdTimestamp
    m.edit(':ping_pong:  |  Pong! - Time taken: **' + diff + 'ms**')
  })
}

module.exports.help = {
  name: 'ping',
  desc: "Test the bot's latency",
  usage: `ping`,
  category: 'Bot',
  aliases: []
}
