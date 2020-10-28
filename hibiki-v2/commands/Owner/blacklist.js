const Command = require("../../lib/Command");

class blacklistCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["blockuser"],
      description: "Adds a user or guild to the blacklist.",
      usage: "<id> | <guildid>",
      allowdisable: false,
      allowdms: true,
      owner: true,
    });
  }

  async run(msg, args) {
    if (!args) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Check if the arguments provided are a number
    if (isNaN(args[0])) {
      // Check if there are multiple arguments (if there are multiple arguments, the user is trying to whitelist a guild)
      if (!args[1]) return;
      if (isNaN(args[1])) return;
      // Add an entry to the DB
      await this.db.table("blacklist").insert({
        guild: args[1],
      });

      // Makes the bot leave the guild
      this.bot.guilds.find(o => o.id == args[1]).leave();
      msg.channel.createMessage(this.bot.embed("✅ Success", "Blacklisted guild.", "success"));
    } else {
      // Add an entry to the DB
      await this.db.table("blacklist").insert({
        user: args[0],
      });
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", "Blacklisted user.", "success"));
    }
  }
}

module.exports = blacklistCommand;
