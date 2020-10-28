const Command = require("../../lib/Command");
const yn = require("../../utils/Ask").YesNo;

class divorceCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Divorces you from your spouse.",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg) {
    // Gets the user's marriage status from the marriageIndex
    const [marriageState] = await this.db.table("marry").getAll(msg.author.id, { index: "marriageIndex" });
    // Handler for if the user isn't married
    if (!marriageState) return msg.channel.createMessage(this.bot.embed("❌ Error", "You aren't married to anyone.", "error"));
    // Asks the author if they're sure they want to divorce
    let divorcemsg = await msg.channel.createMessage(this.bot.embed("💔 Divorce ", "Are you sure you want to divorce your spouse?", "general"));

    // Checks for their response and reacts accordingly
    const resp = await yn(this.bot, {
      author: msg.author,
      channel: msg.channel,
    });

    // Handler for if no response or no was given
    if (!resp) return divorcemsg.edit(this.bot.embed("💔 Divorce", "Cancelled the divorce.", "error"));
    // Deletes the marriage IDs from the DB
    await this.db.table("marry").get(marriageState.id).delete();
    // Sends the confirmation embed notifying the user about their divorce
    divorcemsg.edit(this.bot.embed("💔 Divorce", "You're no longer married.", "general"));
  }
}

module.exports = divorceCommand;
