const Discord = require("discord.js");
const fs = require("fs");
const util = require("../utils/util.js");
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'root', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'db/database.sqlite',
    operatorsAliases: false
});

const Weather = sequelize.define('weather', {
    userid: {
        type: Sequelize.STRING,
        unique: true
    },
    location: Sequelize.STRING,
});

Weather.sync()

module.exports.run = async (bot, msg, args, prefix) => {

  if (args.length >= 1 && args[0] !== 'set' && msg.mentions.users.size == 0) {
    let loc = args.join(' ');
    return util.wSearch(msg, loc);
  }

  else if (args.length >=1 && args[0] == 'set') {

    if (!args[1]) return msg.channel.send(`Type ${prefix}weather set \`[location]\` to set a location.`);
    args.shift();
    let loc = args.join(' ')

    /*let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    weatherData[msg.author.id] = args.join(' ');

    fs.writeFile("./config/weather.json", JSON.stringify(weatherData, null, '\t'), (err) => {
      if (err) return console.log(err);
      else return msg.channel.send(`Your location has been successfully updated to **${weatherData[msg.author.id]}**`)
    });*/
    let userloc = await Weather.findOne({ where: { userid: msg.author.id } })
    if (!userloc) {
      Weather.create({
          userid: msg.author.id,
          location: loc
      }).get('location');
    }
    else {
      Weather.update({ location: loc }, { where: { userid: msg.author.id } });
    }
    return msg.channel.send(`Your location has been successfully updated to **${loc}**`)

  }
  else if (msg.mentions.users.size !== 0) {
    /*let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    let loc = weatherData[msg.mentions.users.first().id]; */
    let mentionID = msg.mentions.users.first().id

    let loc = await Weather.findOne({ where: { userid: mentionID } })

    if (loc) {return util.wSearch(msg, loc.get('location'))}
    else return msg.channel.send(`No weather data found for user **${msg.mentions.users.first().username}**`)
  }
  else if (args.length === 0) {
    /*let weatherData = JSON.parse(fs.readFileSync("./config/weather.json", "utf8"));
    let loc = weatherData[msg.author.id];*/
    let loc = await Weather.findOne({ where: { userid: msg.author.id } })
    console.log(loc)
    if (loc) return util.wSearch(msg, loc.get('location'));
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
