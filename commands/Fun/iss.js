const Discord = require('discord.js')
const axios = require('axios')
const config = require('../../config/config.json')
let mbKey = config.api_keys.mapbox
module.exports.run = async (bot, msg, args, prefix) => {
  let iss = await axios.get('http://api.open-notify.org/iss-now.json')
  let loc = iss.data.iss_position
  let lat = valBetween(loc.latitude, -85, 85)
  let long = valBetween(loc.longitude, -175, 175)
  let longlat = `${long},${lat}`
  let map = `https://api.mapbox.com/styles/v1/voidpls/cjhf4nx0t1lgn2ql0c2dgh99p/static/pin-s-star+ff0000(${longlat})/${longlat},1,0/640x400@2x?access_token=${mbKey}&attribution=false&logo=false`

  let file = new Discord.Attachment(map, 'ISS_Location.png')
  msg.channel
    .send(`🛰 The **International Space Station** is currently located at:`, file)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

let valBetween = (v, min, max) => {
  return Math.min(max, Math.max(min, v))
}

module.exports.help = {
  name: 'ISS',
  desc: "Gets the ISS' current location",
  usage: 'ISS',
  category: 'Fun',
  aliases: ['issloc']
}
