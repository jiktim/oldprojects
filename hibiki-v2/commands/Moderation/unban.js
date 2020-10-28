const Command = require("../../lib/Command");

class unbanCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["idunban", "ub", "unbanid"],
      description: "Unbans a user by their by ID.",
      usage: "<userIDs>",
      clientperms: "banMembers",
      requiredperms: "banMembers",
      staff: true
    });
  }

  async run(msg, args) {
    // Checks arguments for valid userID
    if (args.find(arg => !parseInt(arg))) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided invalid an invalid userID.", "error"));
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage(this.bot.embed("❌ Error", "You must provide one or more userIDs to unban.", "error"));
    // Only allow unbanning 5 people at once
    if (args.length > 5) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can only unban up to 5 users at a time.", "error"));
    // Invalid IDs
    let toolong = args.find(arg => arg.length > 18 || arg.length < 17);
    if (toolong) return msg.channel.createMessage(this.bot.embed("❌ Error", `\`${toolong}\` isn't a valid ID.`, "error"));

    // Tries to unban the users
    const bans = await Promise.all(args.map(async user => {
      try {
        await msg.guild.unbanMember(user, 0, `Unbanned by ${require("../../utils/Format").tag(msg.author)}`);
        return { banned: true, user: user };
      } catch (_) {
        return { banned: false, user: user };
      }
    }));

    // If no bans could be found/anyone unbanned
    const trueBans = bans.filter(b => b.banned);
    const falseBans = bans.filter(b => !b.banned);

    // Handler for if no users could be unbanned
    if (!trueBans.length) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "I wasn't able to unban any of the users specified.", "error"));
    } else {
      // Removes bans and errors out if something happened
      await msg.channel.createMessage({
        embed: {
          title: `🔨 ${trueBans.length} user${trueBans.length == 1 ? "" : "s"} have been unbanned.`,
          description: `${trueBans.map(m => m.user).join(", ")}`,
          fields: falseBans.length ? [{
            name: `Failed to unban ${falseBans.length} user${falseBans.length == 1 ? "" : "s"}.`,
            value: `${falseBans.map(m => m.user).join(", ")}`,
          }] : [],
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = unbanCommand;
