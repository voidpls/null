const axios = require('axios')
const qs = require('querystring')

const chatEndpoint =
  'https://www.pandorabots.com/pandora/talk?botid=d979c4a56e34cb17'

module.exports = async (msg, args) => {
  console.log(`[${new Date()}] chatbot ran`)
  msg.channel.startTyping()
  const text = cleanContent(args.join(' '))
  let reply = await scrapeHTML(text)
  if (reply) {
    reply = formatReply(reply, msg)
    await msg.channel.send(reply)
  } else await msg.channel.send("I don't know how to respond :/")
  return msg.channel.stopTyping(true)
}

async function scrapeHTML(text) {
  return new Promise(async (res, rej) => {
    try {
      let html = await axios.post(
        chatEndpoint,
        qs.stringify({
          input: text
        })
      )
      if (html.status >= 400) rej(`API Error: ${html.status}`)
      let reply = html.data.match(
        /Maid-Chan:<\/b> (.+)(\n| <br><\/body><\/html>)/i
      )
      if (reply) res(reply[1]).trim()
    } catch (e) {
      rej(e)
    }
  })
}

function formatReply(reply, msg) {
  if (reply.match(/you were(.+)years old/gi))
    reply = 'how the fuck should I know?'
  return reply
    .replace(/<br> ?/gi, '\n')
    .replace(/maid-chan/gi, 'Null')
    .replace(/alex badger/gi, 'Void')
    .replace('Your name is ,', `Your name is ${msg.author.username},`)
}

function cleanContent(text) {
  return text.replace(/<@!?[0-9]+>/g, '').trim()
}
