const axios = require('axios')

module.exports.run = async (bot, msg, args, prefix) => {
  let trump = await axios.get(
    'https://api.whatdoestrumpthink.com/api/v1/quotes/random'
  )
  let quote = trump.data.message
  msg.channel
    .send(`"${quote}"\n\n*- Donald Trump*`)
    .catch(e => msg.channel.send(e.error))
}

module.exports.help = {
  name: 'Trump',
  desc: 'Gets a random Trump quote',
  usage: 'trump',
  category: 'Fun',
  aliases: ['donald']
}
