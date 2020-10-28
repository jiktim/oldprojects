const Command = require("../../lib/Command");
const { snowflake } = require("../../lib/Snowflake");

class addpointCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["addrep", "merit", "repadd"],
      description: "Gives a reputation point to a user.",
      usage: "<@user> <reason>",
      requiredperms: "manageMessages",
      staff: true
    });
  }

  // Checks if the author mentioned a valid user
  async run(msg, [mentionorID, ...reason]) {
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);

    // Handler if the member is invalid or can't be found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Sets the reasonString
    let reasonString = reason.join(" ");
    // Slices the reason if it's over a certain amount
    if (reasonString.length > 1000) reasonString = reasonString.slice(0, 1000);
    // Sets the id
    const id = snowflake();

    // Inserts the point to the db
    await this.db.table("points").insert({
      giverId: msg.author.id,
      receiverId: member.id,
      guildId: msg.guild.id,
      id: id,
      reason: reasonString || "No reason provided.",
    });

    // Sends a confirmation embed
    this.bot.emit("pointAdd", msg.guild, msg.member, member, id, reasonString || "No reason provided.");
    msg.channel.createMessage(this.bot.embed("✨ Points", `You've given **${member.username}** a reputation point.`, "success"));
  }
}

module.exports = addpointCommand;
