const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config/config.json");

module.exports.run = async (bot, msg, args, prefix) => {

  var {body} = await superagent
  .get(`http://aws.random.cat/meow`)
  .catch(e => msg.channel.send("ERROR: "+e.message))

  /*while (body.file.slice(-3) == 'mp4') {
    var {body} = await superagent
    .get(`http://aws.random.cat/meow`);
  }*/

  let embed = new Discord.RichEmbed()
  .setColor(config.colors.white)
  .setTitle('🐱 Random Cat')
  .setImage(body.file)
  .setFooter('Source: random.cat');

  await msg.channel.send(embed);

};


module.exports.help = {
  name: "cat",
  desc: "Posts a random cat",
  usage: "cat",
  category: 'Fun',
  aliases: ['randomcat']
}
