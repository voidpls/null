const Discord = require('discord.js')
const util = require('../utils/util.js')
const config = require('../config/config.json')
const mongoose = require('mongoose')
const Tag = mongoose.model('Tag')
const moment = require('moment')
//tag funcs [list, create/add, delete/remove, edit/update, info]

module.exports.run = async (bot, msg, args, prefix) => {
  if (!args[0])
    return msg.channel
      .send(`**Error:** Please specify a valid tag parameter.`)
      .catch(e => util.delCatch(e))

  const conn = mongoose.connection
  const param = args.shift().toLowerCase()
  const modifyParams = ['add', 'create', 'delete', 'remove', 'edit', 'info']

  if (modifyParams.includes(param)) {
    if (args.length < 2)
      return msg.channel
        .send(`**Error:** Please specify tag name and tag content.`)
        .catch(e => util.delCatch(e))
    const gID = msg.guild.id
    const tagname = args.shift().toLowerCase()
    const tagcontent = sanitize(args.join(' '))
    if (tagname.length > 32) {
      let text = `**Error:** The tag's name cannot exceed **32** characters.`
      return msg.channel.send(text)
    }

    if (['add', 'create'].includes(param)) {
      let checktag = await Tag.findOne({
        tagname: tagname,
        guildID: gID
      }).catch(e => console.log(e))
      if (checktag) {
        let text = `**Error:** The tag **\`${tagname}\`** already exists.`
        return msg.channel.send(text)
      }
      if (tagcontent.length > 1950) {
        let text = `**Error:** The tag's content cannot exceed **1950** characters.`
        return msg.channel.send(text)
      }
      const tag = new Tag({
        tagname: tagname,
        content: tagcontent,
        userID: msg.author.id,
        guildID: msg.guild.id
      })
      return tag.save().then(res => {
        let text = `<:check:335548356552294410> The tag **\`${tagname}\`** has been created.`
        msg.channel.send(text)
      })
    }
  }
}

function sanitize(txt) {
  txt = '\u180E' + txt
  txt = txt
    .replace('@everyone', '@\u200beveryone')
    .replace('@here', '@\u200bhere')
    .replace("'", `\'`)
    .replace('"', `\"`)
  return txt
}

// if no tag specified
//   if (args.length === 0) {
//     return msg.channel.send(
//       `**Error:** Invalid tag or function. **\`${prefix}help tags\`** for more info.`
//     )
//   }
//   let param = args[0].toLowerCase()
//   if (args.length === 1 && param !== 'list') {
//     // get tag
//     let tagname = param
//     let tag = await Tags.findOne({
//       where: { tagname: `${msg.guild.id} ${tagname}` }
//     })
//     if (!tag) {
//       return msg.channel.send(
//         `**Error:** Could not find server tag **${args[0]}**`
//       )
//     } else {
//       tag.increment('uses')
//       msg.channel.send(tag.get('content'))
//     }
//   } else {
//     // message includes function
//     // add tag func
//     if (param === 'add' || param === 'create') {
//       if (!args[1]) {
//         return msg.channel.send(`**Error:** Specify a tag name to add!`)
//       }
//
//       let tagname = args[1].toLowerCase()
//       let tag = await Tags.findOne({
//         where: { tagname: `${msg.guild.id} ${tagname}` }
//       })
//
//       if (tag) {
//         return msg.channel.send(
//           `**Error:** The tag **\`${tagname.split(' ')[1]}\`** already exists!`
//         )
//       }
//       if (!args[2]) {
//         return msg.channel.send(`**Error:** Specify the tag's content to add!`)
//       }
//
//       args.splice(0, 2)
//       let tagcontent = tFormat(args.join(' '))
//
//       if (tagname.length > 32) {
//         return msg.channel.send(
//           `**Error:** The tag name cannot exceed **32 characters**!`
//         )
//       }
//       if (tagcontent.length > 1950) {
//         return msg.channel.send(
//           `**Error:** The tag text cannot exceed **1950 characters**!`
//         )
//       } else {
//         let newtag = await Tags.create({
//           tagname: `${msg.guild.id} ${tagname}`,
//           content: tagcontent,
//           userid: msg.author.id
//         })
//
//         return msg.channel.send(
//           `<:check:335544753443831810> The tag **\`${
//             newtag.get('tagname').split(' ')[1]
//           }\`** has been successfully created.`
//         )
//       }
//     } else if (param === 'delete' || param === 'remove') {
//       // delete tag func
//       if (!args[1]) {
//         return msg.channel.send(`**Error:** Specify a tag name to delete!`)
//       }
//       let tagname = args[1].toLowerCase()
//
//       let tag = await Tags.findOne({
//         where: { tagname: `${msg.guild.id} ${tagname}` }
//       })
//       if (!tag) {
//         return msg.channel.send(
//           `**Error:** The tag **\`${args[1]}\`** doesn't exist!`
//         )
//       }
//
//       if (tag.get('userid') !== msg.author.id) {
//         return msg.channel.send(
//           `**Error:** You do not own the tag **\`${tagname}\`**!`
//         )
//       } else {
//         Tags.destroy({ where: { tagname: `${msg.guild.id} ${tagname}` } })
//         return msg.channel.send(
//           `<:check:335544753443831810> The tag **\`${
//             tag.get('tagname').split(' ')[1]
//           }\`** has been successfully deleted.`
//         )
//       }
//     } else if (param === 'edit') {
//       // edit tag func
//       if (!args[1]) {
//         return msg.channel.send(`**Error:** Specify a tag name to edit!`)
//       }
//       let tagname = args[1].toLowerCase()
//
//       let tag = await Tags.findOne({
//         where: { tagname: `${msg.guild.id} ${tagname}` }
//       })
//       if (!tag) {
//         return msg.channel.send(
//           `**Error:** The tag **\`${args[1]}\`** doesn't exist!`
//         )
//       }
//
//       if (tag.get('userid') !== msg.author.id) {
//         return msg.channel.send(
//           `**Error:** You do not own the tag **\`${tagname}\`**!`
//         )
//       } else {
//         if (!args[2]) {
//           return msg.channel.send(
//             `**Error:** Specify what you want **\`${
//               args[1]
//             }\`**'s new content to be!`
//           )
//         }
//
//         args.splice(0, 2)
//         let tagcontent = tFormat(args.join(' '))
//
//         if (tagcontent.length > 1950) {
//           return msg.channel.send(
//             `**Error:** The tag text cannot exceed **1950 characters**!`
//           )
//         }
//
//         Tags.update(
//           { content: tagcontent },
//           { where: { tagname: `${msg.guild.id} ${tagname}` } }
//         )
//         return msg.channel.send(
//           `<:check:335544753443831810> The tag **\`${
//             tag.get('tagname').split(' ')[1]
//           }\`** has been successfully edited.`
//         )
//       }
//     } else if (param === 'info') {
//       // get tag info
//       if (!args[1]) {
//         return msg.channel.send(`**Error:** Specify a tag name to view info!`)
//       }
//       let tagname = args[1].toLowerCase()
//       let tag = await Tags.findOne({
//         where: { tagname: `${msg.guild.id} ${tagname}` }
//       })
//       if (!tag) {
//         return msg.channel.send(
//           `**Error:** The tag **\`${args[1]}\`** doesn't exist!`
//         )
//       } else {
//         let username = `User Left Guild`
//         if (bot.users.get(tag.get('userid'))) {
//           let user = bot.users.get(tag.get('userid'))
//           username = `${user.username}#${user.discriminator}`
//         }
//
//         let createdTS = moment(tag.get('createdAt')).format('MMMM Do, YYYY')
//         let updatedTS = moment(tag.get('updatedAt')).format('MMMM Do, YYYY')
//
//         let embed = new Discord.RichEmbed()
//           .setColor(config.colors.white)
//           .setDescription(
//             `☉ Tag Owner: **${username}**\n` +
//               `☉ Usage Count: **${tag.get('uses')}**\n` +
//               `☉ Creation: **${createdTS}**\n` +
//               `☉ Last Update: **${updatedTS}**`
//           )
//         //  console.log(tag.get('tagname'),tag.get('userid'), , tag.get('createdAt'))
//         msg.channel
//           .send(`📋 Info for tag **${tagname}**:`, embed)
//           .catch(e => msg.channel.send('**Error:** ' + e.message))
//       }
//     } else if (param === 'list') {
//       // list user tags
//       if (args.length >= 2) {
//         let user = util.getUserFromArg(bot, msg, args[1])
//
//         if (!user) {
//           return msg.channel.send(`**Error:** User **${args[1]}** not found!`)
//         } else {
//           let tagArr = await getTags(user, msg)
//           if (tagArr.length === 0) {
//             return msg.channel.send(
//               `**Error:** **${user.username}#${
//                 user.discriminator
//               }** does now own any tags on **${msg.guild.name}**.`
//             )
//           }
//           tagArr = tagArr
//             .map(tag => tag.dataValues.tagname.split(' ')[1])
//             .reverse()
//
//           let embed = new Discord.RichEmbed()
//             .setColor(config.colors.white)
//             .setDescription(tagArr.join(' | '))
//
//           msg.channel
//             .send(
//               `📋 Tag list for **${user.username}#${user.discriminator}**:\n`,
//               embed
//             )
//             .catch(e => msg.channel.send('**Error:** ' + e.message))
//         }
//       } else {
//         let user = msg.author
//         let tagArr = await getTags(user, msg)
//         if (tagArr.length === 0) {
//           return msg.channel.send(
//             `**Error:** **${user.username}#${
//               user.discriminator
//             }** does now own any tags on **${msg.guild.name}**.`
//           )
//         }
//         tagArr = tagArr
//           .map(tag => tag.dataValues.tagname.split(' ')[1])
//           .reverse()
//
//         let embed = new Discord.RichEmbed()
//           .setColor(config.colors.white)
//           .setDescription(tagArr.join(' | '))
//
//         msg.channel.send(
//           `📋 Tag list for **${user.username}#${user.discriminator}**:\n`,
//           embed
//         )
//       }
//     } else
//       return msg.channel
//         .send(
//           `**Error:** Invalid tag or function. **\`${prefix}help tags\`** for more info.`
//         )
//         .catch(e => util.delCatch(e))
//   }
// }
//
// function tFormat(txt) {
//   txt = '\u180E' + txt
//   txt = txt
//     .replace('@everyone', '@\u200beveryone')
//     .replace('@here', '@\u200bhere')
//     .replace("'", "'")
//     .replace('"', '"')
//
//   return txt
// }
//
// async function getTags(user, msg) {
//   let usertags = await Tags.findAll({
//     where: { userid: user.id },
//     attributes: ['tagname']
//   })
//   let tagArr = usertags.filter(
//     tag => tag.dataValues.tagname.split(' ')[0] === msg.guild.id
//   )
//
//   return tagArr
// }

module.exports.help = {
  name: 'tags',
  desc: 'Create and send server-wide tags',
  usage: 'tags (add | edit | delete | info | list) [name] [content]',
  category: 'Fun',
  aliases: ['tag', 't']
}
