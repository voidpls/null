const Discord = require('discord.js')
const axios = require('axios')
const config = require('../config/config.json')
//let mqKey = '7NzCi050ftPX93m9elMDytWj0uv9LAV8'
let mbKey =
  'pk.eyJ1Ijoidm9pZHBscyIsImEiOiJjamhlenZmbzYxMTFoM2RwY28wNXplaXR2In0.UCHDkjtshLi2fWVOLTkufg'

module.exports.run = async (bot, msg, args, prefix) => {
  let iss = await axios.get('http://api.open-notify.org/iss-now.json')
  let loc = iss.data.iss_position
  let lat = valBetween(loc.latitude, -85, 85)
  let long = valBetween(loc.longitude, -175, 175)
  let longlat = `${long},${lat}`
  let map = `https://api.mapbox.com/v4/mapbox.dark/pin-m-star+ff0000(${longlat})/${longlat},2/640x400@2x.png?access_token=${mbKey}`

  let file = new Discord.Attachment(map, 'ISS_Location.png')
  msg.channel
    .send(
      `🛰 The **International Space Station** is currently located at:`,
      file
    )
    .catch(e => msg.channel.send(e.error))
}

valBetween = (v, min, max) => {
  return Math.min(max, Math.max(min, v))
}

module.exports.help = {
  name: 'ISS',
  desc: "Gets the ISS' current location",
  usage: 'ISS',
  category: 'Fun',
  aliases: ['issloc']
}
