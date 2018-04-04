const Discord = require("discord.js");
const fs = require("fs");
const util = require("../utils/util.js");
let blacklistFile = "./config/blacklist.json"

module.exports.run = async (bot, msg, args, prefix) => {

  if (!args[0]) return;

  let blacklist = JSON.parse(fs.readFileSync(blacklistFile, "utf8"));
  let user = util.getUser(msg, args).user

  if (!user) return;

  if (blacklist[user.id]) {
    delete blacklist[user.id];
    console.log(`Unblacklisted ${user.username}#${user.discriminator}`)
  }
  else {
    blacklist[user.id] = user.username
    console.log(`Blacklisted ${user.username}#${user.discriminator}`)
  }

  fs.writeFile(blacklistFile, JSON.stringify(blacklist, null, '\t'), (err) => {
    if (err) return console.log(err);
    else {
      return msg.react(':check:335548356552294410');
    }
  });


};

module.exports.help = {
  name: "blacklist",
}
