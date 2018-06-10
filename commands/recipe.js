const axios = require('axios')
const Discord = require('discord.js')
const config = require('../config/config.json')
const util = require('../utils/util.js')
let apikey = config.api_keys.edamam
let appID = '476d170f'

module.exports.run = async (bot, msg, args, prefix) => {
  if (!args[0])
    return msg.channel.send(`**Usage:** \`${prefix}recipe [query]\``)
  let q = args.join(' ')
  let embed = new Discord.RichEmbed()
  let recipe = await axios.get(
    `https://api.edamam.com/search?q=${q}&app_id=${appID}&app_key=${apikey}&to=3`,
    {
      headers: { 'Accept-Encoding': 'gzip' }
    }
  )
  if (recipe.data.hits.length === 0)
    return msg.channel
      .send(`**Error:** No results found for **${q}**`)
      .catch(e => {
        msg.channel.send(`**Error:** ${e.message}`)
      })

  recipe.data.hits.forEach(hit => {
    let r = hit.recipe
    let rYield = r.yield || 'N/A'
    let fDesc = `Yield: **${rYield}** Servings`
    let rNum = recipe.data.hits.indexOf(hit) + 1
    embed.addField(`${rNum}. ${r.label} | ${r.source}`, fDesc)
  })

  embed
    .setColor(config.colors.white)
    .setFooter('Type a # to select a recipe')
    .setThumbnail(recipe.data.hits[0].recipe.image)
    .setDescription(`Total results: **${util.commas(recipe.data.count)}**`)
    .setAuthor('Recipe Search', 'https://i.imgur.com/f8rp2PF.png')
  msg.channel
    .send(embed)
    .catch(e => {
      msg.channel.send(`**Error:** ${e.message}`)
      return null
    })
    .then(message => {
      if (!message) return
      let filter = m =>
        m.author.id === msg.author.id &&
        parseInt(m.content) <= recipe.data.hits.length &&
        parseInt(m.content) > 0
      message.channel
        .awaitMessages(filter, { maxMatches: 1, time: 20000, errors: ['time'] })
        .then(c => {
          let index = parseInt(c.first().content) - 1
          let newR = recipe.data.hits[index].recipe
          let rYield = `**${newR.yield}** servings` || 'N/A'
          let nEmbed = new Discord.RichEmbed()
            .setThumbnail(newR.image)
            .setColor(config.colors.white)
            .setAuthor(
              `${newR.label} | ${newR.source}`,
              'https://i.imgur.com/f8rp2PF.png'
            )
            .addField('Yield', rYield, true)
            .addField('Calories', `**${util.commas(~~newR.calories)}**`, true)
            .addField(
              'Total Ingredients',
              `**${newR.ingredientLines.length}** Ingredients`,
              true
            )
          if (newR.totalTime > 0)
            nEmbed.addField('Time', `**${newR.totalTime}** mins`, true)
          if (newR.healthLabels.length > 0)
            nEmbed.addField('Health Labels', newR.healthLabels.join(', '), true)
          if (newR.dietLabels.length > 0)
            nEmbed.addField('Diet Labels', newR.dietLabels.join(', '), true)
          if (newR.cautions.length > 0)
            nEmbed.addField('Cautions', newR.cautions.join(', '), true)
          nEmbed
            .addField('Recipe Link', `**${newR.url}**`, true)
            .setFooter('Powered by Edamam Recipe Search')
          message.delete()
          msg.channel
            .send(nEmbed)
            .catch(e => msg.channel.send(`**Error:** ${e.message}`))
        })
        .catch(e => {
          msg.channel.send("Time's up, selection closed.")
        })
    })
}

module.exports.help = {
  name: 'recipe',
  desc: 'Search for a recipe',
  usage: `recipe [query]`,
  category: 'Utilities',
  aliases: ['food', 'recipesearch']
}
