const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config/config.json");
const Fortnite = require('fortnite');
const ftAPI = new Fortnite(config.api_keys.fortnite);

module.exports.run = async (bot, msg, args, prefix) => {

  if (!args[0]) return errors.specifyUser(msg, prefix);
  let platArr = ['pc', 'xbl', 'psn']
  let username;
  let platform;
  let user = args
  //console.log(args)

  if (platArr.includes(user.pop().toLowerCase())) {
    user.pop()
    username = user.join(' ')
    platform = args.pop()
    console.log('1')
  }
  else {
    console.log(args)
    username = args.join(' ')
    platform = 'pc'
    console.log('2')
  }
  console.log(username, platform)

  ftAPI.getInfo(username, platform).then(data => {

    let stats = data.lifetimeStats
      let wins = fstat(stats, 'wins');
    let winPercent = fstat(stats, 'win');
    let top3 = fstat(stats, 'top3s');
    let kills = fstat(stats, 'kills');
    let KD = fstat(stats, 'kd');
    let mPlayed = fstat(stats, 'matchesPlayed');
    //  let tPlayed = fstat(stats, 'timePlayed');
    //let asTime = fstat(stats, 'avgSurvivalTime');

    let embed = new Discord.RichEmbed()
    .setColor(config.colors.white)
    .setTitle('Fortnite Stats')
    .setAuthor(data.platform.toUpperCase()+' | '+data.username, 'https://i.imgur.com/imPQal4.png')
    .setThumbnail('https://i.imgur.com/da8iJVl.png')
    .setFooter('Stats from FortniteTracker.com')

    .addField('Wins', wins, true)
    .addField('Win %', winPercent, true)
    .addField('Top 3\'s', top3, true)
    .addField('Matches Played', mPlayed, true)
    .addField('Kills', kills, true)
    .addField('K/D', KD, true)
    //.addField('Avg. Survival Time', asTime, true)
    //.addField('Time Played', tPlayed, true);

    msg.channel.send(embed)

  }).catch(e => {
    console.log(e);
    return errors.noPlayer(msg, username)
  });

  function fstat(stats, str) {
    return stats.find(s => s.stat == str).value;
  }

};


module.exports.help = {
  name: "fortnite",
  desc: "Check Fortnite stats",
  usage: "fortnite [username] [pc, xbl, psn]",
  category: 'Utilities',
  aliases: ['ftn', 'ft']
}
