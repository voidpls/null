const Discord = require("discord.js");
const fs = require("fs");
const util = require("../utils/util.js");

module.exports.run = async (bot, msg, args, prefix) => {

  if (args.length >= 1 && args[0] !== 'set' && msg.mentions.users.size == 0) {
    let loc = args.join(' ');
    return util.wSearch(msg, loc);
  }

  if (args.length >=1 && args[0] == 'set') {

    if (!args[1]) return msg.channel.send(`Type ${prefix}weather set \`[location]\` to set a location.`);
    let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    args.shift();
    weatherData[msg.author.id] = args.join(' ');

    fs.writeFile("./config/weather.json", JSON.stringify(weatherData, null, '\t'), (err) => {
      if (err) return console.log(err);
      else return msg.channel.send(`Your location has been successfully updated to **${weatherData[msg.author.id]}**`);
    });

  }
  if (msg.mentions.users.size !== 0) {
    let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    let loc = weatherData[msg.mentions.users.first().id];
    if (loc) {return util.wSearch(msg, loc)}
    else return msg.channel.send(`No weather data found for user **${msg.mentions.users.first().username}**`)
  }
  if (args.length === 0) {
    let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    let loc = weatherData[msg.author.id];
    if (weatherData[msg.author.id]) return util.wSearch(msg, loc);
    else msg.channel.send(`Type \`${prefix}weather set [location]\` to set a location.`);
  }
  return;
}

module.exports.help = {
  name: "weather",
  desc: "Checks the weather",
  usage: "weather [location] | weather set [location]",
  category: 'Utilities',
  aliases: ['w']
}
