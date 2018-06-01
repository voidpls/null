const util = require('../utils/util.js')
module.exports.run = async (bot, msg, args, prefix) => {
  msg.delete(5000).catch(e => util.delCatch(e))
  msg.channel.send(args.join(' '))
  console.log('ECHO:\n' + args.join(' '))
}

module.exports.help = {
  name: 'echo'
}
