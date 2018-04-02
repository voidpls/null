const Discord = require("discord.js");
const fs = require("fs");

//No perms error
module.exports.noPerms = (msg, perm) => {

    msg.channel.send(`<:error:335660275481051136> You need **${perm}** to use this command`).then(m => m.delete(5000));

};

//Command not found error
module.exports.noCmd = (msg, cmd) => {

    msg.channel.send(`<:error:335660275481051136> Command **${cmd}** not found`).then(m => m.delete(5000));

};

//Definition not found error
module.exports.notFound = (msg, def) => {

    msg.channel.send(`<:error:335660275481051136> Definition for **${def}** not found`).then(m => m.delete(5000));

};
