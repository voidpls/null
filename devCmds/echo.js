const Discord = require("discord.js");

module.exports.run = async (bot, msg, args, prefix) => {

  msg.channel.send(args.join(' '));
  console.log("ECHO:\n"+args.join(' '));

};

module.exports.help = {
  name: "echo",
}
