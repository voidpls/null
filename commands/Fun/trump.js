const axios = require('axios')
const util = require('../../utils/util.js')

module.exports.run = async (bot, msg, args, prefix) => {
  let query = 'random'
  if (args[0]) {
    query = `personalized?q=**{PLACEHOLDER}**`
  }
  let res = await axios.get(`https://api.whatdoestrumpthink.com/api/v1/quotes/${query}`)
  let quote = res.data.message

  if (args[0]) {
    let user = util.getUserFromArg(bot, msg, args[0])
    if (user) {
      quote = quote.replace('{PLACEHOLDER}', user.username)
    } else {
      quote = quote.replace('{PLACEHOLDER}', args.join(' '))
    }
  }

  msg.channel
    .send(`"${quote}"\n\n*- Donald Trump*`)
    .catch(e => msg.channel.send('**Error:** ' + e.message))
}

module.exports.help = {
  name: 'Trump',
  desc: 'Gets a random Trump quote or generate a personalized one',
  usage: 'trump [user]',
  category: 'Fun',
  aliases: ['donald']
}
