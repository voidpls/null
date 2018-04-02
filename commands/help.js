const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config/config.json");


module.exports.run = async (bot, msg, args, prefix) => {
  //bot.commands.first().help.category


    var categories = Array.from(new Set(bot.commands.map(c => c.help.category)));

    //'Utilities', 'Fun'

    if (args.length != 0) {

      let cmd = args[0].toLowerCase();
      let cmdFile = bot.commands.get(cmd);

      if (cmdFile){

        let cmdName = cmdFile.help.name[0].toUpperCase() + cmdFile.help.name.substr(1)

        let embed = new Discord.RichEmbed()
        .setAuthor(cmdName, bot.user.avatarURL)
        .setDescription(cmdFile.help.desc)
        .setColor(config.colors.white)
        .addField("Usage", prefix+cmdFile.help.usage);


        return msg.channel.send(embed);

      }
      else return errors.noCmd(msg, args[0]);

    }

    let mainacc = bot.users.get(config.mainacc);

    let embed = new Discord.RichEmbed()
    .setAuthor(bot.user.username + " Bot Help", bot.user.avatarURL)
    .setDescription(`Type **${prefix}invite** to invite me!`)
    .setColor(config.colors.white)
    .setFooter(`Made by ${mainacc.username}#${mainacc.discriminator}`)


    categories.forEach((i) => {
      let cmds = bot.commands.filter(c => c.help.category == i)
      .map(c => "**\`"+c.help.name[0].toUpperCase() + c.help.name.substr(1)+"\`**").join('\n');

      embed.addField(i, cmds, true);
    });

    msg.channel.send(embed);

}


module.exports.help = {
  name: "help",
  desc: "View command info",
  usage: `help [command]`,
  category: 'Info'
}
