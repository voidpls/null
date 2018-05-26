const quotes = require('../config/quotes.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let quote = quotes[Math.floor(Math.random() * quotes.length)]
  quote = `"${quote.quoteText}" \n\n*- ${quote.quoteAuthor}*`
  msg.channel.send(quote).catch(e => msg.channel.send(e.message))
}

module.exports.help = {
  name: 'quote',
  desc: 'Sends a random quote of wisdom',
  usage: 'quote',
  category: 'Fun',
  aliases: ['randomquote']
}
