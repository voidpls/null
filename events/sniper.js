const Discord = require('discord.js')
const mime = require('mime/lite')
const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const prohibited = require('../config/config.json').prohibited

let sniped = []
class Message {
  constructor(msg, attachments) {
    this.id = msg.id
    this.content = msg.content
    this.timestamp = Date.now()
    this.author = {
      username: msg.author.username,
      discrim: msg.author.discriminator,
      avatar: msg.author.displayAvatarURL
    }
    this.attachments = attachments
  }
}

module.exports = async bot => {
  bot.on('messageDelete', async msg => {
    if (msg.author.bot || msg.channel.type === 'dm') return
    if (!msg) return
    let attachments = []

    if (msg.attachments.size > 0)
      attachments = await Promise.all(
        msg.attachments.map(async attach => {
          let filename = attach.filename
          let ext = filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
          let fPath = path.join(__dirname, '../db/snipes', `/${attach.id}.${ext}`)
          let file
          try {
            fs.accessSync(fPath)
          } catch (e) {
            return null
          }
          file = fs.createReadStream(fPath)

          if (!file || prohibited.includes(ext.toLowerCase())) return null
          let form = new FormData()
          form.append('file', file, {
            filename: filename
          })
          form.append('name', `.${ext}`)
          let headers = form.getHeaders()
          let url = 'https://cockfile.com/api.php?d=upload-tool'
          let res = await axios.post(url, form, { headers: headers })
          return {
            id: attach.id,
            filename: filename,
            size: attach.filesize,
            type: mime.getType(attach.filename),
            ext: ext,
            url: res.data
          }
        })
      )
    sniped[msg.channel.id] = new Message(msg, attachments)
  })

  bot.on('messageUpdate', async (oldMsg, newMsg) => {
    if (oldMsg.author.bot || oldMsg.channel.type === 'dm') return
    if (!oldMsg || !newMsg) return
    if (oldMsg.content === newMsg.content) return
    let after = new Message(newMsg)
    sniped[oldMsg.channel.id] = [oldMsg.content, after]
  })
}

module.exports.get = async channel => {
  if (sniped[channel]) return sniped[channel]
  else return null
}
module.exports.help = {
  name: 'sniper'
}
