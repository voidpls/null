const Discord = require("discord.js");
const util = require("../utils/util.js");

module.exports.run = async (bot, msg, args, prefix) => {

  try {
    var code = args.join(' ');
    let evaled = eval(code);

    if (typeof evaled !== 'string')
    evaled = require("util").inspect(evaled);
    msg.channel.send('\`\`\`xl\n'+util.clean(evaled)+'\`\`\`').catch(e => msg.channel.send(`\`ERROR\` \`\`\`xl\n${util.clean(e)}\n\`\`\``))
  } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${util.clean(err)}\n\`\`\``)
  }


};

module.exports.help = {
  name: "eval",
}
