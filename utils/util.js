const Discord = require("discord.js");
const config = require("../config/config.json");

//get user function
module.exports.getUser = (msg, args) => {

  let user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));

  if (user === undefined || user === null) {
    user = msg.guild.members.find(m => m.user.username.toLowerCase() === args[0].toLowerCase());
    return user;
  }
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


//weather search
module.exports.wSearch = (msg, loc) => {

  let weather = require("yahoo-weather");
  weather(loc, 'f').then(info => {

    if (!info) return msg.channel.send(`**<:error:335660275481051136> Could not retreive weather data for \`${loc}\``);
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

  });
}
