const Discord = require("discord.js");
const fs = require("fs");

const config = require("./config/config.json");
const prefixFile = "./config/prefix.json"
const blacklistFile = "./config/blacklist.json"
const util = require("./utils/util.js");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.devCommands = new Discord.Collection();

let cooldown = new Set();
let cooldown2 = new Set();

let CDsecs = 2;

//terminal beautification
console.log('-------------------------------------');

//check command files
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  //remove '.js'
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0){
    return console.log("ERROR: No commands found.");
  }
  console.log('→ Module Status: \n-------------------------------------');
  //load modules
  jsfiles.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`√ ${f.slice(0, -3)} loaded successfully`);
    bot.commands.set(props.help.name, props);
  });
  //terminal beautification
  console.log('-------------------------------------');

});

//check dev command files
fs.readdir("./devCmds/", (err, files) => {

  if(err) console.log(err);

  //remove '.js'
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0){
    return console.log("ERROR: No dev commands found.");
  }
  console.log('→ Dev Module Status: \n-------------------------------------');
  //load modules
  jsfiles.forEach((f, i) =>{
    let props = require(`./devCmds/${f}`);
    console.log(`√ ${f.slice(0, -3)} loaded successfully`);
    bot.devCommands.set(props.help.name, props);
  });
  //terminal beautification
  console.log('-------------------------------------');

});

bot.on("error", (e) => console.error(e));
//bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));

//on connect event handler
bot.on("ready", async () => {

  console.log(`→ Successfully connected as ${bot.user.username}`);
  //terminal beautification
  console.log('-------------------------------------');
  console.log(`→ Bot is currently in ${bot.guilds.size} server(s) \n→ Bot is serving ${bot.users.size} members`);

  //set bot status
  bot.user.setActivity("you shower", {type: "WATCHING"});
  bot.user.setStatus('dnd');

  //terminal beautification
  console.log('-------------------------------------');

});


//message event handler
bot.on("message", async msg => {

  //ignore bots
  if(msg.author.bot) return;
  //ignore dms
  if(msg.channel.type === "dm") return ;

  //parse prefix file
  let prefixes = JSON.parse(fs.readFileSync(prefixFile, "utf8"));
  if(!prefixes[msg.guild.id]){
    prefixes[msg.guild.id] = config.prefix;
  }

  let blacklist = JSON.parse(fs.readFileSync(blacklistFile, "utf8"));

  //set prefix
  let prefix = prefixes[msg.guild.id];

/************************************************************/
/*** Code below this line will ignore messages w/o prefix ***/
/************************************************************/

  if(!msg.content.startsWith(prefix)) return;

  //array of words in the message
  let args = msg.content.split(" ").slice(1);
  //pulls command from message
  let cmd = msg.content.split(" ")[0].slice(prefix.length).toLowerCase();

//TEMPORARY
  if (cmd == 'nic' && msg.guild.id == '317978984119795712') return msg.channel.send('<:forsen1:364142529207205889><:forsen2:364143062688989187>\n<:forsen3:364143324900229120><:forsen4:364143377400463360>');
//COMMAND

  let cmdFile = bot.commands.get(cmd);
  if (cmdFile) {

    if (blacklist[msg.author.id]) return setTimeout(() => {msg.delete()}, 3000);
    //check if user is in cooldown set
    if (cooldown.has(msg.author.id)) {

      //check if user is in 2nd cooldown set
      if (cooldown2.has(msg.author.id)) {
        return setTimeout(() => {msg.delete();}, 3000);
      }
      //add user to 2nd cooldown set
      cooldown2.add(msg.author.id);
      //warn + delete messages
      return msg.channel.send(`Please wait **3** seconds between commands, **${msg.author.username}**.`).then(m => {
        setTimeout(() => {m.delete(); msg.delete();}, 3000);
      });
    }

    //add user to 1st cooldown set
    cooldown.add(msg.author.id);
    setTimeout(() => {cooldown.delete(msg.author.id); cooldown2.delete(msg.author.id)}, CDsecs*1000);
    //run command if not in the cooldown set
    cmdFile.run(bot, msg, args, prefix);

  }

  else if (bot.devCommands.get(cmd) && msg.author.id == config.mainacc) bot.devCommands.get(cmd).run(bot, msg, args, prefix);

  else {
    bot.commands.forEach(c => {
      if (c.help.aliases.includes(cmd)) c.run(bot, msg, args, prefix);
      else return;
    });
    return;
  }

});

//login with token
bot.login(config.token);
