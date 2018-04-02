const Discord = require("discord.js");
const fs = require("fs");

const config = require("./config/config.json");
const prefixFile = "./config/prefix.json"

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

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

//on connect event handler
bot.on("ready", async () => {

  console.log(`→ Successfully connected as ${bot.user.username}`);
  //terminal beautification
  console.log('-------------------------------------');
  console.log(`→ Bot is currently in ${bot.guilds.size} server(s)`);
  console.log(`→ Bot is serving ${bot.users.size} members`)

  //set bot status
  bot.user.setActivity("SYNTAX ERROR", {type: "WATCHING"});

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
    prefixes[msg.guild.id] = {
      prefixes: config.prefix
    };
  }
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

  let cmdFile = bot.commands.get(cmd);
  if (cmdFile) cmdFile.run(bot, msg, args, prefix);
  else return;

});

//login with token
bot.login(config.token);
