const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config/config.json");

module.exports.run = async (bot, msg, args, prefix) => {

  let url = await superagent
  .get(`https://thecatapi.com/api/images/get`)
  .then(async res => {
    return await res.headers.original_image
  })
  .catch(e => msg.channel.send("ERROR: "+e.message));
  
  let embed = new Discord.RichEmbed()
  .setColor(config.colors.white)
  .setTitle('🐱 Random Cat')
  .setImage(url)
  .setFooter('Source: thecatapi.com');

  await msg.channel.send(embed);

};


module.exports.help = {
  name: "cat",
  desc: "Posts a random cat",
  usage: "cat",
  category: 'Fun',
  aliases: ['randomcat']
}
