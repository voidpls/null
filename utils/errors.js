const Discord = require("discord.js");
const fs = require("fs");

//No perms error
module.exports.noPerms = async (msg, perm) => {

    await msg.channel.send(`<:error:335660275481051136> You need **${perm}** to use this command`).then(m => m.delete(5000));

};

//Command not found error
module.exports.noCmd = async (msg, cmd) => {

    await msg.channel.send(`<:error:335660275481051136> Command **${cmd}** not found`).then(m => m.delete(5000));

};

//Definition not found error
module.exports.notFound = async (msg, def) => {

    await msg.channel.send(`<:error:335660275481051136> Definition for **${def}** not found`).then(m => m.delete(5000));

};

//Weather data not found
module.exports.weather = async (msg, loc) => {

    await msg.channel.send(`**<:error:335660275481051136> Could not retreive weather data for \`${loc}\`**`);

};

//specify user
module.exports.specifyUser = async (msg) => {

    await msg.channel.send(`**<:error:335660275481051136> Please specify a username and platform.**`);

};

//player not found
module.exports.noPlayer = async (msg, name) => {

    await msg.channel.send(`**<:error:335660275481051136> Player ${name} not found**`);

};

//user not in voice chat
module.exports.noVC = async (msg) => {

    await msg.channel.send(`**<:error:335660275481051136> You must be in a voice chat to use this command**`);

};

//character limit
module.exports.charLimit = async (msg) => {

    await msg.channel.send(`**<:error:335660275481051136> Text must be 0 - 200 characters long!**`);

};


//character limit
module.exports.cantJoin = async (msg) => {

    await msg.channel.send(`**<:error:335660275481051136> I don't have permission to join that VC!**`);

};
