const Command = require("../../lib/Command");

class nicknameCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["nick", "set-nick", "set-nickname"],
      description: "Changes a user's nickname.",
      usage: "<@user> <nickname>",
      clientperms: "manageNicknames",
      requiredperms: "manageNicknames",
      cooldown: 3000,
    });
  }

  async run(msg, [mentionorID, ...nick]) {
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler if the user is invalid or can't be found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Sets the nickname
    const nickname = nick.join(" ");
    // Sets the old nickname
    const oldnick = member.nick;
    // Checks the nickname length
    if (nickname.length > 32) return msg.channel.createMessage(this.bot.embed("❌ Error", "Nickname must be 32 characters or less.", "error"));

    try {
      // Tries to change the user's nickname
      await member.edit({ nick: nickname }, `Nickname command ran by ${require("../../utils/Format").tag(msg.author)}`);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `Nickname ${!nick.length ? "re" : ""}set.`, "success"));
      // Logs to the loggingchannel
      this.bot.emit("nicknameUpdate", msg.channel.guild, msg.author, member, oldnick);
    } catch (err) {
      // Sends if the nickname couldn't be changed
      msg.channel.createMessage(this.bot.embed("❌ Error", "I was unable to change the member's nickname.", "error"));
      return;
    }
  }
}

module.exports = nicknameCommand;
