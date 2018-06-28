const Discord = require('discord.js')
// const errors = require("../utils/errors.js");
global.fetch = require('node-fetch')
const config = require('../config/config.json')
const cc = require('cryptocompare')

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length === 0) {
    cc.priceMulti(['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'EOS'], 'USD').then(
      prices => {
        let embed = new Discord.RichEmbed()
          .setAuthor(
            'Cryptocurrency Values',
            'https://cdn-images-1.medium.com/max/1600/1*U7phpu7aKKrU05JvMvs-wA.png'
          )
          .setColor(config.colors.white)
          .setFooter(
            `Use ${prefix}crypto [crypto symbol] [currency] to get custom results`
          )

        for (const i in prices) {
          embed.addField(i, '$' + prices[i]['USD'], true)
        }

        msg.channel
          .send(embed)
          .catch(e => msg.channel.send('**Error: **' + e.message))
      }
    )
  } else {
    let coin = args[0].toUpperCase()
    let currency = args[1] || 'USD'
    let coinlist = await cc.coinList()
    cc.priceFull(coin, [currency.toUpperCase(), 'BTC', 'ETH'])
      .then(prices => {
        let cData = coinlist.Data[coin]
        currency = currency.toUpperCase()
        let cPrice = prices[coin]
        let pData = cPrice[currency]

        let embed = new Discord.RichEmbed()
          .setAuthor(
            cData.FullName,
            `https://www.cryptocompare.com${cData.ImageUrl}`
          )
          .setColor(config.colors.white)
          .addField(
            `Price (${currency})`,
            pData.PRICE.toString().slice(0, 8),
            true
          )
          .addField(
            `Price (BTC/ETH)`,
            `${cPrice['BTC'].PRICE.toString().slice(0, 8)} | ${cPrice[
              'ETH'
            ].PRICE.toString().slice(0, 8)}`,
            true
          )

          .addField(
            `Market Cap (${currency})`,
            pData.MKTCAP.toLocaleString(),
            true
          )
          .addField(
            `% Change [24h]`,
            pData.CHANGEPCT24HOUR.toFixed(2) + '%',
            true
          )
          .addField(
            `High/Low [24h] (${currency})`,
            `${pData.HIGH24HOUR.toFixed(2)} | ${pData.LOW24HOUR.toFixed(2)}`,
            true
          )
          .addField(`Supply`, pData.SUPPLY.toLocaleString(), true)
          .setFooter(`Last Market: ${pData.LASTMARKET}`)

        msg.channel
          .send(embed)
          .catch(e => msg.channel.send('**Error: **' + e.message))
      })
      .catch(e => {
        console.log(e)
        return msg.channel.send(
          `**Error:** Could not find coin data for **${coin}** in **${currency.toUpperCase()}**`
        )
      })
  }
}

module.exports.help = {
  name: 'crypto',
  desc: 'Checks the worth of any crypto, in any currency.',
  usage: 'crypto [crypto symbol] [currency]',
  category: 'Utilities',
  aliases: ['cryptocurrency', 'cc']
}
