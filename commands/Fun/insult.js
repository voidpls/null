const util = require('../../utils/util.js')
const axios = require('axios')

module.exports.run = async (bot, msg, args, prefix) => {
  let query = '?'
  if (args[0]) {
    let user = util.getUserFromArg(bot, msg, args[0])

    if (user) {
      query = `${query}who=**${user.username}**`
    } else {
      query = `${query}who=**${args.join(' ')}**`
    }
  }

  let res = await axios.get(`https://insult.mattbas.org/api/insult.json${query}`)
  let insult = res.data.insult

  msg.channel.send(insult).catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'insult',
  desc: 'Get an insult or insult a user',
  usage: `insult [who]`,
  category: 'Fun',
  aliases: []
}
