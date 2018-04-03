const Discord = require("discord.js");

module.exports.run = async (bot, msg, args, prefix) => {

  let start = process.hrtime();

  msg.channel.send(":ping_pong:  |  Pong! - Time taken:").then(m => {
    const diff = process.hrtime(start);
    let time = diff[0] * 1000 + diff[1] / 1000000
    m.edit(':ping_pong:  |  Pong! - Time taken: **' + Math.round(time) + 'ms**');
  });

}


module.exports.help = {
  name: "ping",
  desc: "Test the bot's latency",
  usage: `ping`,
  category: 'Bot',
  aliases: []

}
