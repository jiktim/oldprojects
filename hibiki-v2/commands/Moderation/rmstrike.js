const Command = require("../../lib/Command");

class rmstrikeCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["removestrike", "removepunishment", "removepunishments", "rmpunishes", "rmpunishment", "rmstrikes"],
      description: "Removes one or more strikes.",
      usage: "<strikeIDs>",
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  async run(msg, strikeIDs) {
    // Handler for if no strikes were given
    if (!strikeIDs.length) return msg.channel.createMessage(this.bot.embed("❌ Error", `You have to provide a strike ID.`, "error"));

    // Maps the strike IDs
    const strikeSuccess = await Promise.all(strikeIDs.map(async strikeID => {
      if (!strikeID) {
        return { success: false, strikeID: strikeID };
      }

      // Gets the strike IDs
      const id = await this.db.table("strikes").get(strikeID);
      if (!id || id.guildId != msg.guild.id) {
        return { success: false, strikeID: strikeID };
      }

      // Deletes the strike IDs
      await this.db.table("strikes").get(strikeID).delete();
      return { success: true, strikeID: strikeID };
    }));

    // If no strikes could be found/removed
    const trueStrikes = strikeSuccess.filter(b => b.success);
    const falseStrikes = strikeSuccess.filter(b => !b.success);

    // Handler for if no strikes
    if (!trueStrikes.length) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `I wasn't able to remove any strikes given.`, "error"));
    } else {
      // Removes strikes & logs
      this.bot.emit("strikeRemove", msg.guild, msg.member, trueStrikes.map(m => `\`${m.strikeID}\``));
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: `❌ Removed ${trueStrikes.length} strike${trueStrikes.length == 1 ? "" : "s"}.`,
          description: `${trueStrikes.map(m => m.strikeID).join(", ")}`,
          fields: falseStrikes.length ? [{
            name: `Failed to remove some strikes.`,
            value: `Strike IDs: ${falseStrikes.map(m => m.strikeID).join(", ")}`,
          }] : [],
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = rmstrikeCommand;
