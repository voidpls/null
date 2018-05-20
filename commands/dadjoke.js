const Discord = require('discord.js')
const axios = require('axios')

module.exports.run = async (bot, msg, args, prefix) => {
  let res = await axios.get('https://icanhazdadjoke.com/', {
    headers: {
      'User-Agent': 'NodeJS/discord.js Discord Bot',
      Accept: 'application/json'
    }
  })

  let joke = res.data.joke
  msg.channel.send(joke).catch(e => msg.channel.send(e))
}

module.exports.help = {
  name: 'dadjoke',
  desc: 'Gets a random dad joke',
  usage: 'dadjoke',
  category: 'Fun',
  aliases: ['dj', 'dad']
}
