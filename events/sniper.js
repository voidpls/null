const Discord = require('discord.js')
let sniped = []
class Message {
  constructor(msg) {
    this.id = msg.id
    this.content = msg.content
    this.timestamp = Date.now()
    this.author = {
      username: msg.author.username,
      discrim: msg.author.discriminator,
      avatar: msg.author.displayAvatarURL
    }
  }
}

module.exports = async bot => {
  bot.on('messageDelete', async msg => {
    if (msg.author.bot || msg.channel.type === 'dm') return
    if (!msg) return
    sniped[msg.channel.id] = new Message(msg)
  })
  bot.on('messageUpdate', async (oldMsg, newMsg) => {
    if (oldMsg.author.bot || oldMsg.channel.type === 'dm') return
    if (!oldMsg || !newMsg) return
    let after = new Message(newMsg)
    sniped[oldMsg.channel.id] = [oldMsg.content, after]
  })
}

module.exports.get = async channel => {
  if (sniped[channel]) return sniped[channel]
  else return null
}
