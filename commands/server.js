const Discord = require("discord.js");
const config = require("../config/config.json");
const util = require("../utils/util.js");
const moment = require('moment')

module.exports.run = async (bot, msg, args, prefix) => {

  let guild = msg.guild
  let color = config.colors.white
  let icon = guild.iconURL.replace('jpg', 'png?size=1024')
  let guildCreate = guild.createdTimestamp
  let verificationLvl = guild.verificationLevel
  let veriName = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'][verificationLvl]

  let roles = guild.roles.size
  let emotes = guild.emojis.size
  let channels = guild.channels
  let members = guild.members

  let bots = members.filter(m => m.user.bot).size
  let vChannels = channels.filter(c => c.type == 'voice').size
  let tChannels = channels.filter(c => c.type == 'text').size
  let onlineUsers = members.filter(m => m.presence.status != 'offline').size

  if (guild.iconURL) {
    color = await util.getColor(icon)
  }

  let owner = guild.owner.user

  function format(timestamp) {return moment.unix(timestamp/1000).format('MMMM Do, YYYY hh:mma')}

  let embed = new Discord.RichEmbed()
  .setColor(color)
  .setThumbnail(icon)

  .setDescription(
  `☉ Server Owner: **${owner.username}#${owner.discriminator}**\n`+
  `☉ Server ID: **${guild.id}**\n`+
  `☉ Server Region: **${guild.region}**\n`+
  `☉ Verification Level: **${verificationLvl} | ${veriName}**\n`+
  `☉ Members: **${members.size}** [ **${members.size-bots}** Users | **${bots}** Bots]\n`+
  `     :online: **${onlineUsers}**\n`+
  `     <:offline:313956277237710868> **${members.size-onlineUsers}**\n`+
  `☉ Channels: **${channels.size}** [ **${tChannels}** Text | **${vChannels}** Voice]\n`+
  `☉ Roles: **${roles}**\n`+
  `☉ Emotes: **${emotes}**\n`+
  `☉ Server Created: **${format(guildCreate)}**`
)

  msg.channel.send(`🔎 Server Info for **${guild.name}**:`, embed)

};


module.exports.help = {
  name: "server",
  desc: "Shows server info",
  usage: "server",
  category: 'Info',
  aliases: ['serverinfo', 'guild']
}
