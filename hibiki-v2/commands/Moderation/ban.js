const Command = require("../../lib/Command");
const yn = require("../../utils/Ask").YesNo;
const hierarchy = require("../../utils/Hierarchy");

class banCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["b", "banid", "hackban", "idban"],
      description: "Bans a user or a user ID.",
      usage: "<@user> <reason>",
      clientperms: "banMembers",
      requiredperms: "kickMembers",
      cooldown: 2000,
      staff: true,
    });
  }

  async run(msg, [mentionorID, ...reason]) {
    // Handler for if no arguments were given
    if (!mentionorID) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Checks to see if the author mentioned another user and if that user is valid
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler for if no valid member was found
    if (!member) {
      // Try to hackban if a member isnt found
      if (!isNaN(mentionorID) || !(mentionorID[0].length > 18 || mentionorID[0].length < 17)) {
        try {
          // Sends the first msg
          let banmsg = await msg.channel.createMessage(this.bot.embed("🔨 Hackban", `Are you sure you want to ban **${mentionorID}**?`, "general"));
          const resp = await yn(this.bot, { author: msg.author, channel: msg.channel });
          // If no response or an invalid response is given
          if (!resp) return banmsg.edit(this.bot.embed("🔨 Ban", `Cancelled banning **${mentionorID}**.`, "general"));
          await msg.guild.banMember(mentionorID, 0, reason.join(" ") || "No reason provided");
          banmsg.edit(this.bot.embed("🔨 Hackban", `Hackbanned **${mentionorID}**.`, "success"));
        } catch (err) {
          msg.channel.createMessage(this.bot.embed("❌ Error", "Failed to ban one or more users.", "error"));
        }
        return;
      }
      // Handler for if no valid user/ID was found.
      msg.channel.createMessage({
        embed: msg.errorembed("userNotFound"),
      });
      return;
    }

    // if the bot isnt high enough send an error msg
    if (!hierarchy(msg.channel.guild.members.get(this.bot.user.id), member)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `My role isn't high enough to ban **${member.username}**.`, "error"));
      return;
    }

    // Sets the final reason
    let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
    // Checks to see if the bot passes the role hiearchy
    if (hierarchy(msg.member, member)) {
      // Sends an embed asking for y/n
      let banmsg = await msg.channel.createMessage(this.bot.embed("🔨 Ban", `Are you sure you want to ban **${member.username}**?`, "general"));
      // Asks y/n and reacts accordingly
      const resp = await yn(this.bot, {
        author: msg.author,
        channel: msg.channel
      });

      // If no response or an invalid response is given
      if (!resp) return banmsg.edit(this.bot.embed("🔨 Ban", `Cancelled banning **${member.username}**.`, "general"));

      let successfullDM = true;
      // tries to send a msg to the user before banning them
      let DMChannel = await member.user.getDMChannel();
      DMChannel.createMessage({
        embed: {
          title: "🔨 Banned",
          description: `You were banned from **${msg.channel.guild.name}** for the reason: **${finalReason}**.`,
          footer: {
            icon_url: msg.author.dynamicAvatarURL("png", 1024),
            text: `Banned by ${require("../../utils/Format").tag(msg.author)}`
          },
          color: require("../../utils/Colour")("error"),
          timestamp: new Date()
        }
      }).catch(() => { successfullDM = false; });

      // Attempts to ban the user & delete messages
      try {
        await member.ban(1, finalReason);
      } catch (_) {
        // Posts if the user couldn't be banned
        banmsg.edit(this.bot.embed("❌ Error", "I couldn't ban that user.", "error"));
        return;
      }

      // Posts when the member is banned; also logs
      this.bot.emit("guildBan", msg.guild, msg.member, member, finalReason);
      msg.channel.createMessage(this.bot.embed("🔨 Member Banned", `**${require("../../utils/Format").tag(msg.author)}** banned **${require("../../utils/Format").tag(member)}** for the reason: ${finalReason}. ${successfullDM == false ? "**(DM Failed)**" : ""}`, "general"));
    } else {
      // If the author doesn't have permission or something else happened
      msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have permission to do this.", "error"));
    }
  }
}

module.exports = banCommand;
