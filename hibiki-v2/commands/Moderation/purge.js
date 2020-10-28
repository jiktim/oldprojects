const Command = require("../../lib/Command");

class purgeCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["clear", "delete", "nuke", "p"],
      description: "Mass deletes a certain amount of messages.",
      usage: "<amount> <@user>",
      clientperms: "manageMessages",
      requiredperms: "manageMessages",
      cooldown: 3000,
      staff: true
    });
  }

  // Gets the oldest snowflake
  getOldestPossibleSnowflake() {
    return BigInt(Date.now()) - BigInt(1420070400000) << BigInt(22);
  }

  // Compares numbers
  compareSnowflake(num1, num2) {
    return BigInt(num1) > BigInt(num2);
  }

  // Delete strategy
  async deleteStrategy(msg, messages) {
    if (!messages.length) { throw new Error("No messages to delete"); } else if (messages.length === 1) {
      return msg.channel.deleteMessage(messages[0]);
    } else if (messages.length > 1 && messages.length <= 100) {
      return msg.channel.deleteMessages(messages);
    } else {
      const messageCopy = [...messages];
      const delet = async () => {
        // >= 100
        if (messageCopy.length >= 100) {
          const toDelet = messageCopy.splice(0, 100);
          await msg.channel.deleteMessages(toDelet);
          await new Promise(rs => setTimeout(() => rs(), 500));
          return delet();
        }
        await msg.channel.deleteMessages(messageCopy);
        return true;
      };
      return delet();
    }
  }

  async run(msg, [messageCount, userToDelete, invert]) {
    // Handler for if no integer was given
    if (isNaN(messageCount)) return msg.channel.createMessage(this.bot.embed("❌ Error", `You gave an invalid number of messages to purge.`, "error"));
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == userToDelete || `<@${m.id}>` === userToDelete || `<@!${m.id}>` === userToDelete);
    // Checks if it's less than one
    if (messageCount <= 0) return msg.channel.createMessage(this.bot.embed("❌ Error", `You can't purge less than one message.`, "error"));
    // Checks if it's over 200 messages
    if (messageCount > 200) return msg.channel.createMessage(this.bot.embed("❌ Error", `You can't purge more than 200 messages at a time.`, "error"));
    // if the "invert" part of the message isnt valid set it to undefined to avoid people running invert on accident
    if (invert != undefined && invert.toLowerCase() != "--invert") invert = undefined;
    // Grabs messages before the user gives an answer so the message count is more precise
    const messages = await msg.channel.getMessages(parseInt(messageCount) + 1);
    // Sends yn embed
    let purgemsg = await msg.channel.createMessage(this.bot.embed("💣 Purge", `Are you sure you want to purge **${messageCount}** messages? ${invert != undefined ? "(Inverted)" : ""}`, "general"));
    // Response
    const resp = await require("../../utils/Ask").YesNo(this.bot, { author: msg.author, channel: msg.channel }, true);
    if (resp != undefined && resp.response === true) {
      // Deletes the answer
      if (resp.msg !== undefined || resp.msg !== null) resp.msg.delete();
      // Posts embed & deletes it a few seconds after
      await msg.delete(`Nuke command ran by: ${require("../../utils/Format").tag(msg.author)}`);
      const toDelet = messages.filter(m => {
        if (!member) return true;
        if (invert != undefined && m.author.id == member.id) return false;
        if (member && m.author.id === member.id && invert == undefined) return true;
        return true;
      }).map(m => m.id);
      try {
        // Tries to delete the messages
        await this.deleteStrategy(msg, toDelet.filter(m => !this.compareSnowflake(m, this.getOldestPossibleSnowflake())));
      } catch (_) {
        // Posts if a message couldn't be deleted
        msg.channel.createMessage(this.bot.embed("❌ Error", `One or more messages couldn't be deleted. If they're over 14 days old, they can't be purged.`, "error"));
        return;
      }
      // Sends the embed & timeout
      purgemsg.edit(this.bot.embed("💣 Purge", `**${msg.author.username}** deleted **${messages.length - 1}** messages.`, "general")).catch(() => {});
      setTimeout(() => { purgemsg.delete().catch(() => {}); }, 4000);
      // Sends cancel embed
    } else purgemsg.edit(this.bot.embed("💣 Purge", "Cancelled purging.", "error")).catch(() => {});
  }
}

module.exports = purgeCommand;
