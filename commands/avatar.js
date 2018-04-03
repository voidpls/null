const Discord = require("discord.js");
const util = require("../utils/util.js");

module.exports.run = async (bot, msg, args, prefix) => {

  if (args.length == 0) {
    var avatarurl = msg.author.avatarURL
    msg.channel.send(`Here is **${msg.author.username}**'s avatar: \n` + msg.author.avatarURL);
  }

  else if (args.length >= 1) {

    let user = util.getUser(msg, args);
    if (user) msg.channel.send(`Here is **${user.user.username}**'s avatar: \n` + user.user.avatarURL);
    else msg.channel.send(`Could not find user **${args[0]}**. Please mention the user.`);

  }

};


module.exports.help = {
  name: "avatar",
  desc: "Gets a user's avatar",
  usage: "avatar [user]",
  category: 'Info',
  aliases: ['pfp']
}
