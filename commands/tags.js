const Discord = require("discord.js");
const util = require("../utils/util.js");
const config = require("../config/config.json");
const Sequelize = require('sequelize');
const moment = require('moment');

const sequelize = new Sequelize('database', 'root', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'db/database.sqlite',
    operatorsAliases: false
});

const Tags = sequelize.define("tags", {
    tagname: {
        type: Sequelize.STRING,
        unique: true
    },
    content: Sequelize.TEXT,
    userid: Sequelize.STRING,
    uses: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
});

Tags.sync({
//  force: true
});

module.exports.run = async (bot, msg, args, prefix) => {

  //if no tag specified
  if (args.length == 0) return msg.channel.send(`<:error:335660275481051136> **Please specify a tag or function!** \`${prefix}help tags\` for more info.`);
  //get tag
  else if (args.length == 1 && args[0].toLowerCase() != 'list') {

    let tagname = args[0].toLowerCase()
    let tag = await Tags.findOne({ where: { tagname: `${msg.guild.id} ${tagname}` } });
    if (!tag) return msg.channel.send(`<:error:335660275481051136> Could not find server tag **${args[0]}**`);
    else {
      tag.increment('uses');
      msg.channel.send(tag.get('content'));
    }

  }
  //message includes function
  else {

    //add tag func
    if (args[0].toLowerCase() == 'add' || args[0].toLowerCase() == 'create') {

      if (!args[1]) return msg.channel.send(`<:error:335660275481051136> **Specify a tag name to add!**`)

      let tagname = args[1].toLowerCase()
      let tag = await Tags.findOne({ where: { tagname: `${msg.guild.id} ${tagname}` } });

      if (tag) return msg.channel.send(`<:error:335660275481051136> The tag **\`${tagname.split(' ')[1]}\`** already exists!`)
      if (!args[2]) return msg.channel.send(`<:error:335660275481051136> **Specify the tag's content to add!**`)

      args.splice(0, 2)
      let tagcontent = tFormat(args.join(' '))

      if (tagname.length > 32) return msg.channel.send(`<:error:335660275481051136> The tag name cannot exceed **32 characters**!`);
      if (tagcontent.length > 1950) return msg.channel.send(`<:error:335660275481051136> The tag text cannot exceed **1950 characters**!`)
      else {

        let newtag = await Tags.create({
          tagname: `${msg.guild.id} ${tagname}`,
          content: tagcontent,
          userid: msg.author.id,
        })

        return msg.channel.send(`<:check:335544753443831810> The tag **\`${newtag.get('tagname').split(' ')[1]}\`** has been successfully created.`)

      }

    }

    //delete tag func
    if (args[0].toLowerCase() == 'delete' || args[0].toLowerCase() == 'remove') {

      if (!args[1]) return msg.channel.send(`<:error:335660275481051136> **Specify a tag name to delete!**`)
      let tagname = args[1].toLowerCase()

      let tag = await Tags.findOne({ where: { tagname: `${msg.guild.id} ${tagname}` } });
      if (!tag) return msg.channel.send(`<:error:335660275481051136> The tag **\`${args[1]}\`** doesn't exist!`);

      if (tag.get('userid') !== msg.author.id) return msg.channel.send(`<:error:335660275481051136> You do not own the tag **\`${tagname.split(' ')[1]}\`**!`);
      else {
        Tags.destroy({ where: { tagname: `${msg.guild.id} ${tagname}` } });
        return msg.channel.send(`<:check:335544753443831810> The tag **\`${tag.get('tagname').split(' ')[1]}\`** has been successfully deleted.`)
      }

    }

    //edit tag func
    if (args[0].toLowerCase() == 'edit') {
      if (!args[1]) return msg.channel.send(`<:error:335660275481051136> **Specify a tag name to edit!**`)
      let tagname = args[1].toLowerCase()

      let tag = await Tags.findOne({ where: { tagname: `${msg.guild.id} ${tagname}` } });
      if (!tag) return msg.channel.send(`<:error:335660275481051136> The tag **\`${args[1]}\`** doesn't exist!`);

      if (tag.get('userid') !== msg.author.id) return msg.channel.send(`<:error:335660275481051136> You do not own the tag **\`${tagname.split(' ')[1]}\`**!`);
      else {

        if (!args[2]) return msg.channel.send(`<:error:335660275481051136> Specify what you want **\`${args[1]}\`**'s new content to be!`)

        args.splice(0, 2)
        let tagcontent = tFormat(args.join(' '))

        if (tagname.length > 32) return msg.channel.send(`<:error:335660275481051136> The tag name cannot exceed **32 characters**!`);
        if (tagcontent.length > 1950) return msg.channel.send(`<:error:335660275481051136> The tag text cannot exceed **1950 characters**!`)

        Tags.update({ content:  tagcontent}, { where: { tagname: `${msg.guild.id} ${tagname}` } });
        return msg.channel.send(`<:check:335544753443831810> The tag **\`${tag.get('tagname').split(' ')[1]}\`** has been successfully edited.`)

      }

    }

    //get tag info
    if (args[0].toLowerCase() == 'info') {
      if (!args[1]) return msg.channel.send(`<:error:335660275481051136> **Specify a tag name to view info!**`);
      let tagname = args[1].toLowerCase();
      let tag = await Tags.findOne({ where: { tagname: `${msg.guild.id} ${tagname}` } });
      if (!tag) return msg.channel.send(`<:error:335660275481051136> The tag **\`${args[1]}\`** doesn't exist!`);
      else {

        let username = `User Left Guild`
        if (bot.users.get(tag.get('userid'))){
          user = bot.users.get(tag.get('userid'))
          username = `${user.username}#${user.discriminator}`
        }

        let createdTS = moment(tag.get('createdAt')).format('MMMM Do, YYYY')
        let updatedTS = moment(tag.get('updatedAt')).format('MMMM Do, YYYY')

        let embed = new Discord.RichEmbed()
        .setColor(config.colors.white)
        .setDescription(
          `☉ Tag Owner: **${username}**\n`+
          `☉ Usage Count: **${tag.get('uses')}**\n`+
          `☉ Creation: **${createdTS}**\n`+
          `☉ Last Update: **${updatedTS}**`
        );
      //  console.log(tag.get('tagname'),tag.get('userid'), , tag.get('createdAt'))
        msg.channel.send(`📋 Info for tag **${tagname}**:`, embed)
      }

    }
    //list user tags
    if (args[0].toLowerCase() == 'list') {

      if (args.length >= 2) {

        let user = util.getUserFromArg(bot, msg, args[1])

        if (!user) return msg.channel.send(`<:error:335660275481051136> User **${args[1]}** not found!`);
        else {

          let tagArr = await getTags(user, msg);
          if (tagArr.length == 0) return msg.channel.send(`<:error:335660275481051136> **${user.username}#${user.discriminator}** does now own any tags on **${msg.guild.name}**.`);
          tagArr = tagArr.map(tag => tag.dataValues.tagname.split(' ')[1]).reverse()

          let embed = new Discord.RichEmbed()
          .setColor(config.colors.white)
          .setDescription(tagArr.join(' | '));

          msg.channel.send(`📋 Tag list for **${user.username}#${user.discriminator}**:\n`, embed)

        }

      }
      else {

        let user = msg.author
        let tagArr = await getTags(user, msg);
        if (tagArr.length == 0) return msg.channel.send(`<:error:335660275481051136> **${user.username}#${user.discriminator}** does now own any tags on **${msg.guild.name}**.`);
        tagArr = tagArr.map(tag => tag.dataValues.tagname.split(' ')[1]).reverse()

        let embed = new Discord.RichEmbed()
        .setColor(config.colors.white)
        .setDescription(tagArr.join(' | '));

        msg.channel.send(`📋 Tag list for **${user.username}#${user.discriminator}**:\n`, embed)

      }

    }
  }

}

function tFormat(txt) {

  txt = '\u180E' + txt
  txt = txt
  .replace('@everyone', '@\u200beveryone')
  .replace('@here', '@\u200bhere')
  .replace("'", "\'")
  .replace('"', '\"');

  return txt;

}

async function getTags(user, msg) {
  let usertags = await Tags.findAll({
    where: { userid: user.id },
    attributes: ['tagname']
  })
  let tagArr = usertags.filter(tag => tag.dataValues.tagname.split(' ')[0] == msg.guild.id)

  return tagArr
}

module.exports.help = {
  name: "tags",
  desc: "Create and send server-wide tags",
  usage: "tags (add | edit | delete | info | list) [name] [content]",
  category: 'Fun',
  aliases: ['tag', 't']
}
