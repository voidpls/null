const Discord = require("discord.js");
const config = require("../config/config.json");
const errors = require("../utils/errors.js");

//get member function
module.exports.getMember = (msg, args) => {

  let user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));

  if (!user) {
    user = msg.guild.members.find(m => m.user.username.toLowerCase() === args[0].toLowerCase());
    if (user) return user;
    else return undefined;
  }
  else return user;
}

//get user function
module.exports.getUser = (bot, msg, args) => {

  let user = false;
  if (!args[0]) {
    user = msg.author
  }
  else {
    user = bot.users.get(args[0]) || msg.mentions.users.first() || msg.guild.members.find(m => m.user.username.toLowerCase() === args[0].toLowerCase()).user;
  }
  if (!user) return undefined;
  else return user;
}

//seconds to hours, mins, seconds
module.exports.secsToHMS = (secs) => {

  var h = Math.floor(secs / 3600);
  var m = Math.floor(secs % 3600 / 60);
  var s = Math.floor(secs % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hrs, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " mins ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " secs") : "";
  return hDisplay + mDisplay + sDisplay;

}



//clean
module.exports.clean = (text) => {

  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;

}


//get ordinal
module.exports.ordinal = (num) => {

  var s=["th","st","nd","rd"],
      v=num%100;
  return num+(s[(v-20)%10]||s[v]||s[0]);


}
//weather search
module.exports.wSearch = (msg, loc) => {

  let weather = require("yahoo-weather");
  weather(loc, 'f').then(info => {

    if (!info) return errors.weather(msg, loc);
    let item = info.item;
    let cond = item.condition;
    let location = info.location;
    var forecast = item.forecast[0]

    let embed = new Discord.RichEmbed()

    .setColor(config.colors.white)
    .setAuthor(`${location.city}, ${location.region}, ${location.country}`)
    .setFooter(info.lastBuildDate.replace(/\w+[.!?]?$/, ''))
    .setDescription(`Search Term: ${loc}`)
    .setThumbnail(`http://www.voidpls.tk/files/weather/${cond.code}.png`)

    .addField("**Temperature:**",`**${cond.temp}**°F/**${toC(cond.temp)}**°C`)
    .addField("**High/Low:**", `**${forecast.high}**°/**${forecast.low}**°F **| ${toC(forecast.high)}**°/**${toC(forecast.low)}**°C`)
    .addField("**Condition**:", `${cond.text} | **${info.atmosphere.humidity}**% humidity`);

    msg.channel.send(embed);

    function toC(f) {return Math.round((f-32)*5/9);}

  }).catch(e => errors.weather(msg, loc));
}
