const Discord = require('discord.js')
const ChartNode = require('chartjs-node')
global.fetch = require('node-fetch')
const config = require('../../config/config.json')
const cc = require('cryptocompare')

module.exports.run = async (bot, msg, args, prefix) => {
  if (args.length === 0) {
    cc.priceMulti(['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'EOS'], 'USD').then(prices => {
      let embed = new Discord.RichEmbed()
        .setAuthor(
          'Cryptocurrency Values',
          'https://cdn-images-1.medium.com/max/1600/1*U7phpu7aKKrU05JvMvs-wA.png'
        )
        .setColor(config.colors.white)
        .setFooter(`Use ${prefix}cc [crypto] [currency] for detailed info.`)

      for (const i in prices) {
        embed.addField(i, '$' + prices[i]['USD'], true)
      }

      msg.channel.send(embed).catch(e => msg.channel.send('**Error: **' + e.message))
    })
  } else if (['chart', 'graph', 'c'].includes(args[0])) {
    let coin = args[1] || 'BTC'
    let currency = args[2] || 'USD'
    coin = coin.toUpperCase()
    currency = currency.toUpperCase()

    const histoMin = await cc.histoMinute(coin, currency).catch(e => console.log(e))
    let errtxt = `**Error:** Could not find coin data for **${coin}** in **${currency.toUpperCase()}**`
    if (!histoMin) return msg.channel.send(errtxt)

    const data = histoMin.map(m => m.close)
    const labels = histoMin.map((m, i) => ~~((1440 - i) / 60))

    const chartNode = new ChartNode(1000, 500)
    chartNode.on('beforeDraw', Chartjs => {
      let global = Chartjs.defaults.global
      global.defaultFontColor = '#fff'
      global.defaultFontSize = 16
      global.defaultFontStyle = 'bold'
    })

    const cjsOptions = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${coin} Value in ${currency} (Last 24h)`,
            data: data,
            backgroundColor: 'rgba(255,255,255,.3)',
            borderColor: 'rgb(255,255,255)',
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: false,
        legend: { labels: { fontSize: 18 } },
        animation: false,
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `Value (${currency})`
              },
              gridLines: { color: 'rgba(255,255,255,.3)' }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `Time Until Present (Hours)`,
                padding: 0
              },
              time: { unit: 'minute' },
              gridLines: { color: 'rgba(255,255,255,.3)' },
              ticks: { maxTicksLimit: 20 }
            }
          ]
        }
      }
    }

    chartNode
      .drawChart(cjsOptions)
      .then(async () => {
        const buffer = await chartNode.getImageBuffer('image/png').catch(e => console.log(e))
        let attach = new Discord.Attachment(buffer, 'ccgraph.png')
        msg.channel.send(attach).catch(e => `**Error:** ${e.message}`)
        chartNode.destroy()
      })
      .catch(e => console.log(e))
  } else {
    let coin = args[0].toUpperCase()
    let currency = args[1] || 'USD'
    currency = currency.toUpperCase()
    let coinlist = await cc.coinList()

    cc.priceFull(coin, [currency, 'BTC', 'ETH'])
      .then(prices => {
        let cData = coinlist.Data[coin]
        let cPrice = prices[coin]
        let pData = cPrice[currency]

        let embed = new Discord.RichEmbed()
          .setAuthor(cData.FullName, `https://www.cryptocompare.com${cData.ImageUrl}`)
          .setColor(config.colors.white)
          .addField(`Price (${currency})`, pData.PRICE.toString().slice(0, 8), true)
          .addField(
            `Price (BTC/ETH)`,
            `${cPrice['BTC'].PRICE.toString().slice(0, 8)} | ${cPrice['ETH'].PRICE.toString().slice(
              0,
              8
            )}`,
            true
          )

          .addField(`Market Cap (${currency})`, pData.MKTCAP.toLocaleString(), true)
          .addField(`% Change [24h]`, pData.CHANGEPCT24HOUR.toFixed(2) + '%', true)
          .addField(
            `High/Low [24h] (${currency})`,
            `${pData.HIGH24HOUR.toFixed(2)} | ${pData.LOW24HOUR.toFixed(2)}`,
            true
          )
          .addField(`Supply`, pData.SUPPLY.toLocaleString(), true)
          .setFooter(`Last Market: ${pData.LASTMARKET}`)

        msg.channel.send(embed).catch(e => msg.channel.send('**Error: **' + e.message))
      })
      .catch(e => {
        let text = `**Error:** Could not find coin data for **${coin}** in **${currency.toUpperCase()}**`
        return msg.channel.send(text)
      })
  }
}

module.exports.help = {
  name: 'crypto',
  desc: 'Checks the worth of any crypto, in any currency.',
  usage: 'crypto [crypto] [currency] | chart [crypto]',
  category: 'Utilities',
  aliases: ['cryptocurrency', 'cc']
}
