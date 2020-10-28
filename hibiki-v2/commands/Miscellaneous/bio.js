const Command = require("../../lib/Command");

class bioCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["addbio", "custombio", "profilebio", "removebio", "rmbio", "userbio"],
      description: "Sets a custom bio to display on your profile.",
      usage: "<bio> | remove",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if too big of a bio was given or if too small of one was given
    if (args.join(" ").length > 100) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided a custom bio longer than 100 characters.", "error"));

    // Gets the author's ID from the db
    let cfg = await this.db.table("userconfig").get(msg.author.id);
    // Handler for if no arguments were given
    if (!args.length && (!cfg || !cfg.bio)) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sends the user's bio if no args were given & it was set
    else if (!args.length && cfg && cfg.bio) return msg.channel.createMessage(this.bot.embed("👤 Your Bio", cfg.bio, "general"));

    // Inserts blank data if no config exists
    if (!cfg) {
      cfg = {
        id: msg.author.id,
        bio: null,
      };
      await this.db.table("userconfig").insert(cfg);
    }

    // Lets users remove their bio
    if (["clear", "delete", "remove"].includes(args.join(" ").toLowerCase())) {
      cfg.bio = null;
      await this.db.table("userconfig").get(msg.author.id).update(cfg);
      msg.channel.createMessage(this.bot.embed("👤 Bio", "Your custom bio has been removed.", "general"));
      return;
    }

    // Sets the bio to their arguments
    cfg.bio = args.join(" ");
    // Blocks discord ads from being put in the bio
    if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|list)|discordapp\.com\/invite)\/.+[a-z]/.test(cfg.bio)) return msg.channel.createMessage(this.bot.embed("❌ Error", "Your bio included an advertisement.", "error"));
    // Updates the db
    await this.db.table("userconfig").get(msg.author.id).update(cfg);
    // Sends a success embed
    msg.channel.createMessage(this.bot.embed("👤 Bio", "Your custom bio has been set! View it using the user command.", "success"));
  }
}

module.exports = bioCommand;
