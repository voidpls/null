
// No perms error
module.exports.noPerms = async (msg, perm) => {
  msg.channel.send(`**Error:** You need the **${perm}** perm to use this command`)
    .then(m => { m.delete(5000); msg.delete() })
}

module.exports.noPerms2 = async (msg, perm) => {
  msg.channel.send(`**Error:** I don't have the **${perm}** perm`)
    .then(m => { m.delete(5000); msg.delete() })
}

// Command not found error
module.exports.noCmd = async (msg, cmd) => {
  msg.channel.send(`**Error:** Command **${cmd}** not found`).then(m => m.delete(5000))
    .then(m => { m.delete(5000); msg.delete() })
}

// Definition not found error
module.exports.notFound = async (msg, def) => {
  msg.channel.send(`**Error:** Definition for **${def}** not found`).then(m => m.delete(5000))
    .then(m => { m.delete(5000); msg.delete() })
}

// Weather data not found
module.exports.weather = async (msg, loc) => {
  msg.channel.send(`**Error:** Could not retreive weather data for **\`${loc}\`**`)
    .then(m => { m.delete(5000); msg.delete() })
}

// specify user
module.exports.specifyUser = async (msg, prefix) => {
  msg.channel.send(`**Usage: \`${prefix}fortnite [username] [xbl/psn]\`**`)
    .then(m => { m.delete(5000); msg.delete(5000) })
}

// player not found
module.exports.noPlayer = async (msg, name) => {
  msg.channel.send(`**Error:** Player **${name} not found**`)
    .then(m => m.delete(5000))
}

// user not in voice chat
module.exports.noVC = async (msg) => {
  msg.channel.send(`**Error:** You must be in a voice chat to use this command.`)
}

// character limit
module.exports.charLimit = async (msg) => {
  msg.channel.send(`**Error:** Text must be **0 - 200** characters long!`)
}

// character limit
module.exports.cantJoin = async (msg) => {
  msg.channel.send(`**Error:** I don't have permission to join that VC!`)
}
