const Command = require("../../lib/Command");
const yn = require("../../utils/Ask").YesNo;
const hierarchy = require("../../utils/Hierarchy");

class softbanCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["sb"],
      description: "Bans a user without deleting messages.",
      usage: "<@user> <reason>",
      clientperms: "banMembers",
      requiredperms: "kickMembers",
      cooldown: 2000,
      staff: true,
    });
  }

  async run(msg, [mentionorID, ...reason]) {
    // Checks if the author mentioned a valid user
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler for if no/an invalid member was given
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // If the bot isnt high enough
    if (!hierarchy(msg.channel.guild.members.get(this.bot.user.id), member)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `My role isn't high enough to ban **${member.username}**.`, "error"));
      return;
    }

    // Logs to the audit log & asks for confirmation
    let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
    if (hierarchy(msg.member, member)) {
      let banmsg = await msg.channel.createMessage(this.bot.embed("🔨 Softban", `Are you sure you want to softban **${member.username}**?`, "general"));
      // Asks y/n and reacts accordingly
      const resp = await yn(this.bot, { author: msg.author, channel: msg.channel });
      // Sends if no response was given
      if (!resp) return banmsg.edit(this.bot.embed("🔨 Ban", `Cancelled banning **${member.username}**.`, "general"));
      let successfullDM = true;
      // Tries to send a msg to the user before banning them
      let DMChannel = await member.user.getDMChannel();
      DMChannel.createMessage({
        embed: {
          title: "🔨 Softbanned",
          description: `You were softbanned from **${msg.channel.guild.name}** for the reason: **${finalReason}**.`,
          footer: {
            icon_url: msg.author.dynamicAvatarURL("png", 1024),
            text: `Kicked by ${require("../../utils/Format").tag(msg.author)}`
          },
          color: require("../../utils/Colour")("error"),
          timestamp: new Date()
        }
      }).catch(() => { successfullDM = false; });

      // Tries to ban
      try {
        await member.ban(0, `${finalReason}`);
      } catch (_) {
        // Posts if the user couldn't be banned
        banmsg.edit(this.bot.embed("❌ Error", "I couldn't softban that user.", "error"));
        return;
      }

      // Posts when the member is banned; also shows if they failed to get the DM; log
      this.bot.emit("guildBan", msg.guild, msg.member, member, reason);
      msg.channel.createMessage(this.bot.embed("🔨 Member Softbanned", `**${require("../../utils/Format").tag(msg.author)}** softbanned **${require("../../utils/Format").tag(member)}** for the reason: ${finalReason}. ${successfullDM == false ? "**(DM Failed)**" : ""}`, "general"));
    } else {
      // If the author doesn't have permission
      msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have permission to do this.", "error"));
    }
  }
}

module.exports = softbanCommand;
