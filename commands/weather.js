const util = require('../utils/util.js')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'root', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/database.sqlite',
  operatorsAliases: false
})

const Weather = sequelize.define('weather', {
  userid: {
    type: Sequelize.STRING,
    unique: true
  },
  location: Sequelize.STRING
})

Weather.sync()

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length >= 1 && args[0] !== 'set' && msg.mentions.users.size === 0) {
    let loc = args.join(' ')
    return util.wSearch(msg, loc)
  } else if (args.length >= 1 && args[0] === 'set') {
    if (!args[1])
      return msg.channel
        .send(`Type ${prefix}weather set \`[location]\` to set a location.`)
        .catch(e => msg.channel.send('**Error:** ' + e.message))
    args.shift()
    let loc = args.join(' ')

    let userloc = await Weather.findOne({ where: { userid: msg.author.id } })
    if (!userloc) {
      Weather.create({
        userid: msg.author.id,
        location: loc
      }).get('location')
    } else {
      Weather.update({ location: loc }, { where: { userid: msg.author.id } })
    }
    return msg.channel
      .send(`Your location has been successfully updated to **${loc}**`)
      .catch(e => msg.channel.send('**Error:** ' + e.message))
  } else if (
    msg.mentions.users.size !== 0 &&
    msg.mentions.users.last().id !== bot.user.id
  ) {
    let mentionID = msg.mentions.users.last().id

    let loc = await Weather.findOne({ where: { userid: mentionID } })

    if (loc) {
      return util.wSearch(msg, loc.get('location'))
    } else
      msg.channel
        .send(
          `No weather data found for user **${
            msg.mentions.users.last().username
          }**`
        )
        .catch(e => msg.channel.send('**Error:** ' + e.message))
  } else if (args.length === 0) {
    let loc = await Weather.findOne({ where: { userid: msg.author.id } })
    if (loc) return util.wSearch(msg, loc.get('location'))
    else
      msg.channel
        .send(`Type \`${prefix}weather set [location]\` to set a location.`)
        .catch(e => msg.channel.send('**Error:** ' + e.message))
  }
}

module.exports.help = {
  name: 'weather',
  desc: 'Checks the weather',
  usage: 'weather [location] | weather set [location]',
  category: 'Utilities',
  aliases: ['w']
}
