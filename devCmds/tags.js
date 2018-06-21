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

  const param = args.shift().toLowerCase()
  const allParams = [
    'add',
    'create',
    'edit',
    'modify',
    'delete',
    'remove',
    'info',
    'owner',
    'list'
  ]
  const modifyParams = ['add', 'create', 'edit', 'modify']

  //modify tag functions
  if (modifyParams.includes(param)) {
    if (args.length < 2)
      return msg.channel
        .send(`**Error:** Please specify the tag name and content.`)
        .catch(e => util.delCatch(e))
    const gID = msg.guild.id
    const tagname = args.shift().toLowerCase()

    const tagcontent = args.join(' ')
    if (tagname.length > 32) {
      let text = `**Error:** The tag's name cannot exceed **32** characters.`
      return msg.channel.send(text)
    }

    if (['add', 'create'].includes(param)) {
      // ADD TAG
      console.log('add')

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
        createdAt: new Date(),
        tagname: tagname,
        content: tagcontent,
        userID: msg.author.id,
        guildID: msg.guild.id
      })
      return tag.save().then(res => {
        let text = `<:check:335548356552294410> The tag **\`${tagname}\`** has been created.`
        msg.channel.send(text)
      })
    } else if (['edit', 'modify'].includes(param)) {
      // EDIT TAG
      console.log('edit')
      const tag = await Tag.findOne({
        tagname: tagname,
        guildID: gID
      }).catch(e => console.log(e))
      if (!tag) {
        let text = `**Error:** The tag **\`${tagname}\`** doesn't exist.`
        return msg.channel.send(text)
      } else if (tag.userID !== msg.author.id) {
        let text = `**Error:** You do not own the tag **\`${tagname}\`**.`
        return msg.channel.send(text)
      }
      if (tagcontent.length > 1950) {
        let text = `**Error:** The tag's content cannot exceed **1950** characters.`
        return msg.channel.send(text)
      }
      return tag
        .update({ content: tagcontent, lastModified: new Date() })
        .then(res => {
          let text = `<:check:335548356552294410> Edited **\`${tagname}\`** successfully.`
          msg.channel.send(text)
        })
    }
  } else if (['delete', 'remove'].includes(param)) {
    // DELETE TAG
    console.log('delete')
    const tagname = args.shift().toLowerCase()

    const tag = await Tag.findOne({
      tagname: tagname,
      guildID: msg.guild.id
    }).catch(e => console.log(e))

    if (!tag) {
      let text = `**Error:** The tag **\`${tagname}\`** doesn't exist.`
      return msg.channel.send(text)
    } else if (tag.userID !== msg.author.id) {
      let text = `**Error:** You do not own the tag **\`${tagname}\`**.`
      return msg.channel.send(text)
    }
    return Tag.findByIdAndDelete(tag.id).then(res => {
      let text = `<:check:335548356552294410> Edited **\`${tagname}\`** successfully.`
      msg.channel.send(text)
    })
  } else if (['info', 'owner'].includes(param)) {
    // GET TAG INFO
    console.log('info')
    const tagname = args.shift().toLowerCase()

    const tag = await Tag.findOne({
      tagname: tagname,
      guildID: msg.guild.id
    }).catch(e => console.log(e))

    if (!tag) {
      let text = `**Error:** The tag **\`${tagname}\`** doesn't exist.`
      return msg.channel.send(text)
    }
    let username = `N/A`
    if ((user = bot.users.get(tag.userID)))
      username = `${user.username}#${user.discriminator}`

    let desc =
      `☉ Tag Owner: **${username}**\n` +
      `☉ Usage Count: **${tag.uses}**\n` +
      `☉ Creation: **${moment(tag.createdAt).format('MMMM Do, YYYY')}**\n` +
      `☉ Last Update: **${moment(tag.modifiedAt).format('MMMM Do, YYYY')}**`
    let embed = new Discord.RichEmbed()
      .setTitle(`\\📋 Tag Info for ${tagname}:`)
      .setColor(config.colors.white)
      .setDescription(desc)
    msg.channel
      .send(embed)
      .catch(e => msg.channel.send('**Error:** ' + e.message))
  } else if (param === 'list') {
    // list user tags
    console.log('list')
    let user = msg.author
    if (args[0]) user = util.getUserFromArg(bot, msg, args[0]) || msg.author
    let tags = await Tag.find(
      {
        userID: user.id,
        guildID: msg.guild.id
      },
      'tagname'
    ).catch(e => console.log(e))
    if (tags.length < 1) {
      let username = user.username
      let gName = msg.guild.name
      let text = `**Error:** User **${username}** does not own any tags on **${gName}**`
      return msg.channel.send(text)
    }
    let tagsDesc = tags.map((t, i) => `**\`${t.tagname}\`**`).join(', ')
    if (tagsDesc.length > 1024) tagsDesc = tagsDesc.substr(0, 1021) + '...'
    let embed = new Discord.RichEmbed()
      .setTitle(`\\📋 Tag List for ${user.username}:`)
      .setDescription(tagsDesc)
      .setColor(config.colors.white)
    msg.channel.send(embed)
  } else if (args.length === 0) {
    // GET TAG CONTENT
    console.log('check')

    let checktag = await Tag.findOneAndUpdate(
      {
        tagname: param,
        guildID: msg.guild.id
      },
      { $inc: { uses: 1 } }
    ).catch(e => console.log(e))
    if (checktag) {
      let text = sanitize(checktag.content)
      return msg.channel.send(text)
    } else
      return msg.channel.send(
        `**Error:** The tag **\`${param}\`** doesn't exist.`
      )
  }

  function sanitize(txt) {
    txt = '\u200B' + txt
    return txt
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace("'", `\'`)
      .replace('"', `\"`)
      .replace(/<@!?[0-9]+>/g, input => {
        let id = input.replace(/<|!|>|@/g, '')
        let member = msg.guild.members.get(id)
        if (member) return `@${member.user.username}`
        return input
      })
      .replace(/<@&[0-9]+>/g, input => {
        let role = msg.guild.roles.get(input.replace(/<|@|>|&/g, ''))
        if (role) return `@${role.name}`
        return input
      })
  }
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
