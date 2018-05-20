const axios = require('axios')
const Discord = require('discord.js')
const config = require('../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let categories = [
    'inspire',
    'management',
    'sports',
    'life',
    'funny',
    'love',
    'art',
    'students'
  ]
  let rand = categories[Math.floor(Math.random() * categories.length)]
  console.log(rand)
  let res = await axios.get(`https://quotes.rest/qod?category=${rand}`, {
    headers: { accept: 'application/json' }
  })
  let quoteJSON = res.data.contents.quotes
  console.log(quoteJSON)
  //msg.channel.send(quoteJSON.quote).catch(e => msg.channel.send(e.error))
}

module.exports.help = {
  name: 'quote',
  desc: 'Sends a random quote',
  usage: 'quote',
  category: 'Fun',
  aliases: ['randomquote']
}
