const axios = require('axios')
const util = require('../utils/util.js')

module.exports.run = async (bot, msg, args, prefix) => {
  let query = 'random'
  if (args[0]) {
    let user = util.getUserFromArg(bot, msg, args[0])

    if (user) {
      query = `personalized?q=**${user.username}**`
    } else {
      query = `personalized?q=**${args.join(' ')}**`
    }
  }
  let res = await axios.get(
    'https://api.whatdoestrumpthink.com/api/v1/quotes/' + query
  )
  let quote = res.data.message
  msg.channel
    .send(`"${quote}"\n\n*- Donald Trump*`)
    .catch(e => msg.channel.send(e.error))
}

module.exports.help = {
  name: 'Trump',
  desc: 'Gets a random Trump quote or generate a personalized one',
  usage: 'trump [user]',
  category: 'Fun',
  aliases: ['donald']
}
