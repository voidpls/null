const Discord = require('discord.js')

module.exports = async bot => {
  bot.on('error', async err => console.log(`Bot Error:`, err))
}

module.exports.help = {
  name: 'error'
}
