const Command = require("../../lib/Command");
const yn = require("../../utils/Ask").YesNo;

class marryCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["propose", "spouse"],
      description: "Asks another user to marry you.",
      usage: "<@user>",
      cooldown: 15000,
    });
  }

  async run(msg, [mentionorID]) {
    // Checks to see if the author mentioned another user and if that user is valid
    let member;
    if (mentionorID && mentionorID.length) member = msg.channel.guild.members.find(m => {
      if (mentionorID == m.id) return m;
      if (mentionorID == `<@${m.id}>`) return m;
      if (mentionorID == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(mentionorID)) return m;
    });

    // Handler for if no member or an invalid member is mentioned
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Handler for if the author mentions themselves
    if (member.id == msg.author.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't marry yourself.", "error"));

    // Reads the marriage index
    const marriageStates = await this.db.table("marry").getAll(msg.author.id, member.id, { index: "marriageIndex" });

    // Handler for if the author is already married
    if (marriageStates.find(m => m.id === msg.author.id || m.marriedTo === msg.author.id)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You're already married to someone.", "error"));
      return;
    }

    // Handler for if the mentioned user is already married
    if (marriageStates.find(m => m.id === member.id || m.marriedTo === member.id)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** is already married.`, "error"));
      return;
    }

    // Asks for the other user's confirmation
    let message = await msg.channel.createMessage(this.bot.embed("💍 Marry", `**${member.username}**, do you wish to marry **${msg.author.username}**? You have **15s** to respond with yes or no.`, "general"));
    // Asks for YN
    const resp = await yn(this.bot, { author: member.user, channel: msg.channel });
    // Updates the DB
    if (resp) {
      await this.db.table("marry").insert({ id: msg.author.id, marriedTo: member.id });
      // Sends the embed
      message.edit(this.bot.embed("💍 Marry", "You're now married!", "success"));
    } else {
      // Sends an error if it timed out or the other user's response is no
      message.edit(this.bot.embed("💍 Marry", "Marriage cancelled.", "error"));
    }
  }
}

module.exports = marryCommand;
