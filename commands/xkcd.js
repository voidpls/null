const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config/config.json");
const xkcd = require('xkcd-api');

module.exports.run = async (bot, msg, args, prefix) => {

  let embed = new Discord.RichEmbed()
  .setColor(config.colors.white)
  .setAuthor('xkcd', 'https://i.imgur.com/tpBYAnU.jpg')

  if (args.length == 1 && args[0].toLowerCase() == 'latest') {
    xkcd.latest((err, res) => {

      if(err) console.log(err);
      embed.setImage(res.img)
      .setTitle(`Latest Comic: *${res.title}*`)
      .setDescription(`Alt: *${res.alt}*`)
      .setFooter(`Comic #${res.num}`)
      msg.channel.send(embed);

    });
  }
  else if (args.length == 1 && args[0] === parseInt(args[0], 10)) {
    xkcd.get(args[0] ,(err, res) => {

      if(err) console.log(err);
      embed.setImage(res.img)
      .setTitle(`Latest Comic: *${res.title}*`)
      .setDescription(`Alt: *${res.alt}*`)
      .setFooter(`Comic #${res.num}`)
      msg.channel.send(embed);

    });
  }
  else {
    xkcd.random((err, res) => {

      if(err) console.log(err);
      embed.setImage(res.img)
      .setTitle(`Random Comic: *${res.title}*`)
      .setDescription(`Alt: *${res.alt}*`)
      .setFooter(`Comic #${res.num}`)
      msg.channel.send(embed);

    });
  }

};


module.exports.help = {
  name: "xkcd",
  desc: "Posts a specific or random xkcd comic",
  usage: "xkcd [latest, comic #]",
  category: 'Fun',
  aliases: []
}
