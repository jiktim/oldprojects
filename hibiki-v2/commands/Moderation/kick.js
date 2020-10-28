const Command = require("../../lib/Command");
const yn = require("../../utils/Ask").YesNo;
const hierarchy = require("../../utils/Hierarchy");

class kickCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["k"],
      description: "Kicks a user.",
      usage: "<@user>",
      clientperms: "kickMembers",
      requiredperms: "kickMembers",
      cooldown: 2000,
      staff: true,
    });
  }

  // Checks if the author mentioned a valid user
  async run(msg, [mentionorID, ...reason]) {
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler for if no/invalid member
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // if the bot isnt high enough send an error msg
    if (!hierarchy(msg.channel.guild.members.get(this.bot.user.id), member)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `My role isn't high enough to kick **${member.username}**.`, "error"));
      return;
    }

    // Sets the finalReason
    let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
    if (hierarchy(msg.member, member)) {
      // Asks y/n embed
      let kickmsg = await msg.channel.createMessage(this.bot.embed("🔨 Kick", `Are you sure you want to kick **${member.username}**?`, "general"));
      // Asks y/n and reacts accordingly
      const resp = await yn(this.bot, { author: msg.author, channel: msg.channel });
      // Cancels kick if no was given
      if (!resp) return kickmsg.edit(this.bot.embed("🔨 Kick", `Cancelled kicking **${member.username}**.`, "general"));

      let successfullDM = true;
      // tries to send a msg to the user before kicking them
      let DMChannel = await member.user.getDMChannel();
      DMChannel.createMessage({
        embed: {
          title: "🔨 Kicked",
          description: `You were kicked from **${msg.channel.guild.name}** for the reason: **${finalReason}**.`,
          footer: {
            icon_url: msg.author.dynamicAvatarURL("png", 1024),
            text: `Kicked by ${require("../../utils/Format").tag(msg.author)}`
          },
          color: require("../../utils/Colour")("error"),
          timestamp: new Date()
        }
      }).catch(() => { successfullDM = false; });

      // Tries to kick the user
      try {
        await member.kick(finalReason);
      } catch (_) {
        // Posts if the user couldn't be kicked
        kickmsg.edit(this.bot.embed("❌ Error", "I couldn't kick that user.", "error"));
        return;
      }

      // Posts when the member is kicked; logs
      this.bot.emit("guildKick", msg.guild, msg.member, member, finalReason);
      msg.channel.createMessage(this.bot.embed("🔨 Kick", `**${require("../../utils/Format").tag(msg.author)}** kicked **${require("../../utils/Format").tag(member)}** for the reason: ${finalReason}. ${successfullDM == false ? "**(DM Failed)**" : ""}`, "error"));
    } else {
      // If the author doesn't have permission
      msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have permission to do this.", "error"));
    }
  }
}

module.exports = kickCommand;
