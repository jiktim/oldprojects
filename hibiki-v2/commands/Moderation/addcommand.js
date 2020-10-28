const Command = require("../../lib/Command");

class addcommandCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Creates a custom command.",
      usage: "<name> <output>",
      aliases: ["addcmd", "createcmd", "createcommand", "newcmd"],
      requiredperms: "manageMessages",
      cooldown: 3000,
      staff: true,
    });
  }

  async run(msg, [name, ...output]) {
    if (!name || !name.length || !output || !output.length) {
      // Gets the guildconfig
      let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
      // Error handler for if no arguments are given
      if (!guildconfig || !guildconfig.customCommands || !guildconfig.customCommands.length) {
        msg.channel.createMessage({
          embed: msg.errorembed("noArguments"),
        });
      } else {
        // Sends a list of custom commands
        msg.channel.createMessage(this.bot.embed("📖 Custom commands", guildconfig.customCommands.map(cmd => `\`${cmd.name}\``).join(", "), "general"));
      }
      return;
    }

    // Sets the output
    output = output.join(" ");
    // Handler for if the name is over 20 characters
    if (name.length > 20) return msg.channel.createMessage(this.bot.embed("❌ Error", "Name must be under **20** characters.", "error"));
    // Handler for if the output is over 1000 characters
    if (output.length > 1000) return msg.channel.createMessage(this.bot.embed("❌ Error", "Output must be under **1000** characters.", "error"));
    // Handler for if the name of the command is an already existing command
    if (this.bot.commands.find(cmd => cmd.id == name || cmd.aliases.includes(name))) return msg.channel.createMessage(this.bot.embed("❌ Error", "That command already exists.", "error"));

    let img;
    // URL checker regex
    let urlcheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.exec(output);
    if (urlcheck && (urlcheck[0].endsWith(".jpg") || urlcheck[0].endsWith(".png") || urlcheck[0].endsWith(".gif"))) output = output.slice(0, urlcheck.index) + output.slice(urlcheck.index + urlcheck[0].length, output.length);
    if (urlcheck && (urlcheck[0].endsWith(".jpg") || urlcheck[0].endsWith(".png") || urlcheck[0].endsWith(".gif"))) img = urlcheck[0];
    // Sets the attachment
    if (msg.attachments && msg.attachments[0]) img = msg.attachments[0].proxy_url;

    // Gets the guildconfig
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // Inserts the custom command
    if (!guildconfig) {
      await this.db.table("guildconfig").insert({
        id: msg.guild.id,
        customCommands: [],
      });
      guildconfig = {
        id: msg.guild.id,
        customCommands: [],
      };
    }

    if (!guildconfig.customCommands) guildconfig.customCommands = [];
    // No more than 10 custom commands
    if (guildconfig.customCommands.length >= 30) return msg.channel.createMessage(this.bot.embed("❌ Error", "You cant have more than **30** commands.", "error"));
    // Handler for if the command already exists
    if (guildconfig.customCommands.find(cmd => cmd.name == name)) return msg.channel.createMessage(this.bot.embed("❌ Error", `The command **${name}** already exists.`, "error"));

    // Adds the custom command to the guildconfig and updates it
    guildconfig.customCommands.push({
      name: name,
      output: output,
      createdBy: msg.author.id,
      image: img ? img : null
    });

    await this.bot.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
    this.bot.emit("commandCreate", msg.channel.guild, msg.author, name);
    // Sends the success embed
    msg.channel.createMessage(this.bot.embed("✅ Success", `Successfully created command **${name}** with output: **${output}**`, "success"));
  }
}

module.exports = addcommandCommand;
