const Command = require("../../lib/Command");

class whitelistCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["allowuser"],
      description: "Removes a user or guild from the blacklist.",
      usage: "<id> | <guildid>",
      allowdisable: false,
      allowdms: true,
      owner: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Checks if the arguments provided are a number
    if (isNaN(args[0])) {
      // Check if there are multiple arguments
      if (!args[1]) return;
      if (isNaN(args[1])) return;
      // Deletes the entry from the DB
      await this.db.table("blacklist").filter({ guild: args[1] }).delete();
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", "Whitelisted guild.", "success"));
    } else {
      // Deletes the entry from the DB
      await this.db.table("blacklist").filter({ user: args[0] }).delete();
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", "Whitelisted user.", "success"));
    }
  }
}

module.exports = whitelistCommand;
