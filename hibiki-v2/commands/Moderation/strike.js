const Command = require("../../lib/Command");
const { snowflake } = require("../../lib/Snowflake");

class strikeCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["punish", "s", "warn"],
      description: "Gives a user a strike.",
      usage: "<@user> <reason>",
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  async run(msg, [mentionorID, ...reason]) {
    // Checks for a valid user
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler for if no valid member was found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Sets the reasonString
    let reasonString = reason.join(" ");
    if (reasonString.length > 1000) reasonString = reasonString.slice(0, 1000);
    // Sets the snowflake
    const id = snowflake();

    // Inserts data into the DB
    await this.db.table("strikes").insert({
      giverId: msg.author.id,
      receiverId: member.id,
      guildId: msg.guild.id,
      id: id,
      reason: reasonString || "No reason provided.",
    });

    // Sends the embed; log
    this.bot.emit("strikeAdd", msg.guild, msg.member, member, id, reasonString || "No reason provided.");
    msg.channel.createMessage(this.bot.embed("🔨 Strike", `You've given **${member.username}** a strike.`, "success"));
  }
}

module.exports = strikeCommand;
