const Discord = require('discord.js')
const config = require('../../config/config.json')
const google = require('google-it')

google.resultsPerPage = 10

module.exports.run = async (bot, msg, args, prefix) => {
    if (!args[0]) {
        return msg.channel.send('**Error:** Please specify a search query!')
    }

    const query = args.join(' ')

    const results = await google({query, disableConsole:true, limit:7})
    if (results.length === 0) return msg.channel.send(`**Error:** No results found for **${query}**`)
    if (results.length > 3) results.length = 3
    let embed = new Discord.RichEmbed()
        .setAuthor('Google Search', 'https://i.imgur.com/pQK0r5l.png')
        .setColor(config.colors.white)
        .setDescription(`Search results for: **${query}**`)
        // .setFooter(`www.google.com/search?&q=${args.join('%20')}`)
    results.map(r => {
        embed.addField(r.title, `**${r.link}**`)
    })
    // google(query, function(err, res) {
    //     if (err) return msg.channel.send('**Error: ** ' + err.message)
    //     let count = 0
    //     let count2 = 0
    //
    //     while (count2 < 3) {
    //         let link = res.links[count]
    //         if (link && link.link) {
    //             count2++
    //             embed.addField(link.title, `**${link.link}**`)
    //         }
    //         if (count >= 6) {
    //             return msg.channel.send(`**Error:** No results found for **${query}**`)
    //         }
    //         count++
    //     }
    //
    //     let url = res.url
    //         .split('&')
    //         .splice(0, 2)
    //         .join('&')
    //         .slice(8)
    //     embed.setFooter(url)

    msg.channel.send(embed).catch(e => msg.channel.send('**Error: **' + e.message))

}

module.exports.help = {
    name: 'google',
    desc: "Google's a search query",
    usage: 'google [query]',
    category: 'Utilities',
    aliases: ['g', 'search']
}
