const Command = require("../../lib/Command");

class cleanCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["c"],
      description: "Deletes the last 10 messages from the bot.",
      clientperms: "manageMessages",
      requiredPerms: "manageMessages",
      cooldown: 3000,
      staff: true,
    });
  }

  async run(msg) {
    // Sends the first message
    let cleanmsg = await msg.channel.createMessage(this.bot.embed("💣 Clean", "Are you sure you'd like to delete the **10** most recent messages from me?", "general"));
    // Sets the response
    const resp = await require("../../utils/Ask").YesNo(this.bot, { author: msg.author, channel: msg.channel }, true);
    // If the response is true
    if (resp != undefined && resp.response === true) {
      // Deletes the user's answer
      if (resp.msg !== undefined || resp.msg !== null) resp.msg.delete();
      cleanmsg.delete();
      // Gets the 100 most recent messages
      let msgs = await msg.channel.getMessages(100);
      // Filters the messages for the bot's ID
      msgs = msgs.filter(m => m.author.id == this.bot.user.id);
      // Maps the messages to their IDs
      msgs = msgs.map(m => m.id);
      // Gets the bot's latest 10 messages
      msgs.splice(msgs.length - 10, msgs.length);
      // Tries to delete the messages
      msg.channel.deleteMessages(msgs).catch(() => {});
    } else {
      // Sends if there was no response/no was given
      cleanmsg.edit(this.bot.embed("💣 Clean", "Cancelled cleaning messages.", "error"));
      return;
    }
  }
}

module.exports = cleanCommand;
