const Discord = require("discord.js");
const errors = require("../utils/errors.js");
var googleTTS = require('google-tts');

module.exports.run = async (bot, msg, args, prefix) => {

  //msg.channel.send('This command isn\'t finished.');

  let text = args.join(' ');
  let vc = msg.member.voiceChannel

  if (!msg.member.voiceChannel) return errors.noVC(msg);
  else {

    if (text.length > 200 || text.length == 0) return errors.charLimit(msg);
    if (!vc.joinable) return errors.cantJoin(msg);
    else {

      vc.join().then(con => {
      //   googleTTS(text, 'en', 1).then(mp3 => {
      //   googleTTS.convert(text, filename, callback]);
      //
      //     let dispatcher = con.playArbitraryInput('mp3', {volume: 2});
      //     console.log(mp3)
      //     /*dispatcher.on("end", end => {
      //       dispatcher.pause()
      //     });*/
      //
      //   }).catch(e => console.log(e));
       }).catch(e => console.log(e));

      GoogleTTS.convert('test', filename, (mp3) => {
        console.log(mp3)
      })

    }

  }

}


module.exports.help = {
  name: "tts",
  desc: "Plays text-to-speech audio in a vc",
  usage: "tts [text - 200 character limit]",
  category: 'Fun',
  aliases: ['texttospeech']
}
