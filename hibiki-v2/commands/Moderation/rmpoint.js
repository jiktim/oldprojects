const Command = require("../../lib/Command");

class rmpointCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["pointrem", "removepoint", "rempoint", "rmmerit", "rmpoints", "unmerit"],
      description: "Removes a reputation point from a user.",
      usage: "<id>",
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  async run(msg, pointIDs) {
    // Handler for if no point were given
    if (!pointIDs.length) return msg.channel.createMessage(this.bot.embed("❌ Error", `You have to provide a point ID.`, "error"));

    // Maps the points IDs
    const pointSuccess = await Promise.all(pointIDs.map(async pointID => {
      if (!pointID) {
        return { success: false, pointID: pointID };
      }

      // Gets the point IDs
      const id = await this.db.table("points").get(pointID);
      if (!id || id.guildId != msg.guild.id) {
        return { success: false, pointID: pointID };
      }

      // Deletes the point IDs
      await this.db.table("points").get(pointID).delete();
      return { success: true, pointID: pointID };
    }));

    // If no points could be found/removed
    const truePoints = pointSuccess.filter(b => b.success);
    const falsePoints = pointSuccess.filter(b => !b.success);

    // Handler for if no points
    if (!truePoints.length) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `I wasn't able to remove any reputation points given.`, "error"));
    } else {
      // Removes points & logs
      this.bot.emit("pointRemove", msg.guild, msg.member, truePoints.map(m => m.pointID));
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: `❌ Removed ${truePoints.length} point${truePoints.length == 1 ? "" : "s"}.`,
          description: `${truePoints.map(m => m.pointID).join(", ")}`,
          fields: falsePoints.length ? [{
            name: "Failed to remove some points.",
            value: `Point IDs: ${falsePoints.map(m => m.pointID).join(", ")}`,
          }] : [],
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = rmpointCommand;
