const Command = require("../../lib/Command");

class prefixCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["setprefix", "whatprefix", "whatisprefix"],
      description: "Sets or views the bot's prefix.",
      usage: "<prefix>",
      allowdisable: false,
      cooldown: 3000,
    });
  }

  async run(msg, args) {
    // Trims the prefix
    let prefix = args.join(" ").trim();
    // Handler for if a prefix over 15 characters was given; sends the current server's prefix
    if (prefix.length > 15 || prefix.length <= 0) {
      let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
      if (!guildconfig) {
        await this.db.table("guildconfig").insert({
          id: msg.guild.id,
          prefix: "",
        });
        msg.channel.createMessage(prefix.length > 15 ? this.bot.embed("❌ Error", "That prefix is too long. The max it can be is 15 characters.", "error") : this.bot.embed("🤖 Prefix", `The current prefix for this server is \`${guildconfig != undefined && guildconfig.prefix != undefined ? guildconfig.prefix : this.bot.config.prefix}\`.`, "general"));
      }
      if (guildconfig.prefix === "") { guildconfig.prefix = this.bot.config.prefix; }
      msg.channel.createMessage(prefix.length > 15 ? this.bot.embed("❌ Error", "That prefix is too long. The max it can be is 15 characters.", "error") : this.bot.embed("🤖 Prefix", `The current prefix for this server is \`${guildconfig != undefined && guildconfig.prefix != undefined ? guildconfig.prefix : this.bot.config.prefix}\`.`, "general"));
      return;
    }

    // Lets members without permission check the prefix, but not set it
    if (!msg.member.permission.has("manageGuild")) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have permission to set the prefix.", "error"));
      return;
    }

    // Inserts the guildconfig ID into the DB if it isn't found
    const guildconfig = await this.db.table("guildconfig").get(msg.guild.id);
    if (!guildconfig) {
      await this.db.table("guildconfig").insert({
        id: msg.guild.id,
        prefix: prefix,
      });
      return;
    }

    // Inserts the guild prefix into the DB
    await this.db.table("guildconfig").get(msg.guild.id).update({
      id: msg.guild.id,
      prefix: prefix,
    });
    // Logs to the logchannel
    this.bot.emit("guildPrefixChange", msg.channel.guild, prefix, msg.author);
    // Sends the prefix
    msg.channel.createMessage(this.bot.embed("✅ Success", `The prefix for this server was set to \`${prefix}\`.`, "success"));
  }
}

module.exports = prefixCommand;
