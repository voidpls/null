const Discord = require("discord.js");


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
