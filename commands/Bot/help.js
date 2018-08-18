const Discord = require('discord.js')
const errors = require('../../utils/errors.js')
const config = require('../../config/config.json')

module.exports.run = async (bot, msg, args, prefix) => {
  let categories = Array.from(new Set(bot.commands.map(c => c.help.category)))

  if (args.length !== 0) {
    let cmd = args[0].toLowerCase()
    let cmdFile = bot.commands.get(cmd)

    if (!cmdFile) {
      bot.commands.forEach(c => {
        if (c.help.aliases.includes(cmd)) cmdFile = c
      })
    }
    if (cmdFile) {
      let cmdName = cmdFile.help.name[0].toUpperCase() + cmdFile.help.name.substr(1)
      let aliasArr = cmdFile.help.aliases
      let aliases = cmdFile.help.name.toLowerCase()
      if (aliasArr.length !== 0) {
        aliases = aliases + ` | ${aliasArr.join(' | ')}`
      }

      let embed = new Discord.RichEmbed()
        .setAuthor(cmdName, bot.user.avatarURL)
        .setDescription(cmdFile.help.desc)
        .setColor(config.colors.white)
        .addField('Usage', prefix + cmdFile.help.usage)
        .addField('Aliases', aliases)

      return msg.channel.send(embed).catch(e => msg.channel.send('**Error: **' + e.message))
    } else return errors.noCmd(msg, args[0])
  }
  let listlinks =
    '**[Discord Bots](https://bots.discord.pw/bots/430081374444191775) | ' +
    '[Listcord](https://listcord.com/bot/430081374444191775) | ' +
    '[Discord Bot List](https://discordbots.org/bot/430081374444191775)**'
  let embed = new Discord.RichEmbed()
    .setAuthor(bot.user.username + ' Bot Help', bot.user.avatarURL)
    .setDescription(
      `**${prefix}invite** for my support server and invite. My prefix is **${prefix}**`
    )
    .setColor(config.colors.white)
    .setFooter(`Use ${prefix}help [command] for command specific help!`)

  categories.forEach(i => {
    let cmds = bot.commands
      .filter(c => c.help.category === i)
      .map(c => '**`' + c.help.name[0].toUpperCase() + c.help.name.substr(1) + '`**')
      .join(' ')
    // '[a](http://google.com)
    embed.addField(i, cmds, true)
  })

  msg.channel
    .send(embed /*.addField('Bot List Links', listlinks, true)*/)
    .catch(e => msg.channel.send('**Error: **' + e.message))
}

module.exports.help = {
  name: 'help',
  desc: 'View command info',
  usage: `help [command]`,
  category: 'Bot',
  aliases: ['cmd', 'command']
}
