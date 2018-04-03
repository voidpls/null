const Discord = require("discord.js");
const util = require("../utils/util.js");

module.exports.run = async (bot, msg, args, prefix) => {

  if (args.length >= 1) {
    let loc = args.join(' ');
    util.wSearch(msg, loc);
  }



};


module.exports.help = {
  name: "weather",
  desc: "Checks the weather",
  usage: "weather [location] | weather set [location]",
  category: 'Utilities',
  aliases: ['w']
}
