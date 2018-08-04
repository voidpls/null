const Discord = require('discord.js')
const config = require('../config/config.json')
const util = require('../utils/util.js')
const axios = require('axios')
const moment = require('moment-timezone')
const mongoose = require('mongoose')
const Weather = mongoose.model('Weather')
const geocodeKey = config.api_keys.geocode
const darkskyKey = config.api_keys.darksky

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length >= 1 && args[0] !== 'set' && msg.mentions.users.size === 0) {
    let loc = args.join(' ')
    return wSearch(msg, loc)
  } else if (args.length >= 1 && args[0] === 'set') {
    if (!args[1]) {
      return msg.channel
        .send(`Type ${prefix}weather set \`[location]\` to set a location.`)
        .catch(e => msg.channel.send('**Error:** ' + e.message))
    }
    args.shift()
    let loc = args.join(' ')

    let userloc = await Weather.findOne({ userID: msg.author.id }).catch(e => console.log(e))
    if (!userloc) {
      const weather = new Weather({
        userID: msg.author.id,
        location: loc
      })
      weather.save().catch(e => console.log(e))
    } else {
      userloc.update({ location: loc }).catch(e => console.log(e))
    }
    return msg.channel
      .send(`Your location has been successfully updated to **${loc}**`)
      .catch(e => console.log(e))
  } else if (msg.mentions.users.size > 0 && msg.mentions.users.first().id !== bot.user.id) {
    let mentionID = msg.mentions.users.first().id

    let loc = await Weather.findOne({ userID: mentionID }).catch(e => console.log(e))

    if (loc) {
      return wSearch(msg, loc.get('location'))
    } else {
      msg.channel
        .send(`No weather data found for user **${msg.mentions.users.first().username}**`)
        .catch(e => msg.channel.send('**Error:** ' + e.message))
    }
  } else if (args.length === 0) {
    let loc = await Weather.findOne({ userID: msg.author.id }).catch(e => console.log(e))
    if (loc) return wSearch(msg, loc.get('location'))
    else {
      msg.channel
        .send(`Type \`${prefix}weather set [location]\` to set a location.`)
        .catch(e => msg.channel.send('**Error:** ' + e.message))
    }
  }
}

async function wSearch(msg, loc) {
  let geoQ = `https://maps.googleapis.com/maps/api/geocode/json?key=${geocodeKey}&address=${loc}`
  let geocode = await axios.get(geoQ).catch(e => console.log(e))
  if (!geocode || geocode.status >= 400 || geocode.data.results.length === 0)
    return msg.channel.send(`**Error:** Location not found.`)
  let lat = geocode.data.results[0].geometry.location.lat,
    long = geocode.data.results[0].geometry.location.lng,
    formatLoc = geocode.data.results[0].formatted_address

  let weatherQ = `https://api.darksky.net/forecast/${darkskyKey}/${lat},${long}?exclude=[minutely,alerts,flags]`
  let weather = await axios
    .get(weatherQ)
    .catch(e => msg.channel.send(`**Error:** Location not found.`))
  if (!weather || weather.status >= 400) return

  let currently = weather.data.currently,
    hourly = weather.data.hourly,
    daily = weather.data.daily.data[0]
  let time = moment
    .unix(currently.time)
    .tz(weather.data.timezone)
    .format('ddd, DD MMM h:mm a')
  let cTemp = Math.round(currently.temperature),
    cApparent = Math.round(currently.apparentTemperature)
  let dHigh = Math.round(daily.temperatureHigh),
    dLow = Math.round(daily.temperatureLow)
  let sunrise = moment
      .unix(daily.sunriseTime)
      .tz(weather.data.timezone)
      .format('**h:mm** a'),
    sunset = moment
      .unix(daily.sunsetTime)
      .tz(weather.data.timezone)
      .format('**h:mm** a')
  let humidity = ~~(currently.humidity * 10000) / 100
  let precip = ~~(daily.precipProbability * 100)

  let embed = new Discord.RichEmbed()
    .setAuthor(`${formatLoc}`, 'https://darksky.net/images/darkskylogo.png')
    .setDescription(hourly.summary)
    .setThumbnail(`https://voidxd.me/null/darksky/${currently.icon}.png`)
    .setColor(config.colors.white)
    .setFooter(`Powered by Dark Sky • ${time}`)
    .addField('Temperature', `**${cTemp}**°F/**${toC(cTemp)}**°C`, true)
    .addField(
      'High/Low',
      `**${dHigh}**°/**${dLow}**°F | **${toC(dHigh)}**°/**${toC(dLow)}**°C`,
      true
    )
    .addField('Condition', `${currently.summary}`, true)
    .addField('Humidity', `\\💦 **${humidity}**%`, true)
    .addField('Precipitation', `\\☔ **${precip}**% chance`, true)
    .addField('Sunrise/Sunset', `${sunrise} | ${sunset}`, true)

  msg.channel.send(embed).catch(e => msg.channel.send(`**Error:** ${e}`))
}
function toC(f) {
  return Math.round(((f - 32) * 5) / 9)
}

module.exports.help = {
  name: 'weather',
  desc: 'Checks the weather',
  usage: 'weather [location] | set [location]',
  category: 'Utilities',
  aliases: ['w', 'forecast']
}
