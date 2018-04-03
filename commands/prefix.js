const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, msg, args, prefix) => {

  if(!msg.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(msg, "Administrator");

  let prefixes = JSON.parse(fs.readFileSync("./config/prefix.json", "utf8"));

  if (!args[0]) return msg.channel.send(`**Usage:** \`${prefix}prefix [new prefix]\``).then(m => m.delete(5000));
  prefixes[msg.guild.id] = args[0];

  fs.writeFile("./config/prefix.json", JSON.stringify(prefixes, null, '\t'), (err) => {
    if (err) console.log(err)
  });

  msg.channel.send(`<:check:335544753443831810> Prefix has been updated to **${args[0]}**`);

}


module.exports.help = {
  name: "prefix",
  desc: "Change the bot's prefix",
  usage: `prefix [new prefix]`,
  category: 'Bot',
  aliases: []

}
