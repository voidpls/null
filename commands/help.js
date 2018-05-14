const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config/config.json");


module.exports.run = async (bot, msg, args, prefix) => {


    var categories = Array.from(new Set(bot.commands.map(c => c.help.category)));

    if (args.length != 0) {

      let cmd = args[0].toLowerCase();
      let cmdFile = bot.commands.get(cmd);

      if (cmdFile){

        let cmdName = cmdFile.help.name[0].toUpperCase() + cmdFile.help.name.substr(1);
        let aliasArr = cmdFile.help.aliases
        let aliases = `${cmd} | ${aliasArr.join(' | ')}`

        let embed = new Discord.RichEmbed()
        .setAuthor(cmdName, bot.user.avatarURL)
        .setDescription(cmdFile.help.desc)
        .setColor(config.colors.white)
        .addField("Usage", prefix+cmdFile.help.usage)
        .addField("Aliases", aliases);


        return msg.channel.send(embed);

      }
      else return errors.noCmd(msg, args[0]);

    }

    let mainacc = bot.users.get(config.mainacc);

    let embed = new Discord.RichEmbed()
    .setAuthor(bot.user.username + " Bot Help", bot.user.avatarURL)
    .setDescription(`Type **${prefix}invite** to invite me!`)
    .setColor(config.colors.white)
    .setFooter(`Use ${prefix}help [command] for command specific help!`)


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
  category: 'Info',
  aliases: []
}
