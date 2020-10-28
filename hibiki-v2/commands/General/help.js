const Command = require("../../lib/Command");
const Eris = require("eris");

class helpCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["commands", "listcmds", "listcommands"],
      description: "Displays a list of commands or info about a specific command.",
      usage: "<command> | here",
      allowdisable: false,
      allowdms: true,
    });
  }

  async run(msg, args) {
    let label = "";
    // Prettier categories
    function categoryEmoji(category) {
      switch (category) {
        case "Fun":
          label = "🎉 Fun";
          break;
        case "General":
          label = "🤖 General";
          break;
        case "Miscellaneous":
          label = "❓ Miscellaneous";
          break;
        case "Moderation":
          label = "🔨 Moderation";
          break;
        case "NSFW":
          label = "🔞 NSFW";
          break;
        case "Owner":
          label = "⛔ Owner";
          break;
        default:
          label = "Unknown";
          break;
      }
      return label;
    }

    let cmd;
    // Returns help about an individual command
    if (args) {
      cmd = this.bot.commands.find(c => c.id.toLowerCase() == args.join(" ").toLowerCase() || c.aliases.includes(args.join(" ").toLowerCase()));
    }

    // Sends if cmd not found
    if (!cmd) {
      let db = undefined;
      if (msg.channel.type != "1") db = await this.bot.db.table("guildconfig").get(msg.guild.id);
      // Sets up the embed
      let categories = [];
      // Removes owner commands
      this.bot.commands.forEach(c => {
        if (!categories.includes(c.category) && c.category != "Owner") categories.push(c.category);
      });
      // Hides owner commands from the help menu
      if (db && db.disabledCategories) categories = categories.filter(c => !db.disabledCategories.includes(c));
      // Category sorting
      let sortedcategories = [];

      // Hides owner commands from the command list
      let owneramt = 0;
      this.bot.commands.forEach(c => c.category == "Owner" ? owneramt++ : null);
      categories = categories.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      // Sets the category label/emojis
      categories.forEach(e => {
        sortedcategories[categories.indexOf(e)] = categoryEmoji(e);
      });

      // Lets users run -help here to get help in the channel
      if (args && args.join(" ").toLowerCase() == "here") {
        msg.channel.createMessage({
          embed: {
            fields: categories.map(category => ({
              name: sortedcategories[categories.indexOf(category)],
              // Hides disabled commands
              value: this.bot.commands.map(c => {
                if (db != undefined && db.disabledCmds != undefined && db.disabledCmds.includes(c.id)) return;
                if (c.category != category) return;
                return `\`${c.id}\``;
              }).join(" "),
            })),
            footer: {
              icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
              text: `${this.bot.commands.size - owneramt} commands loaded`,
            },
            color: require("../../utils/Colour")("general"),
          },
        });
        return;
      }

      // Gets the author's DM channel
      let DMChannel = await msg.author.getDMChannel();
      let dmson = await DMChannel.createMessage({
        embed: {
          fields: categories.map(category => ({
            name: sortedcategories[categories.indexOf(category)],
            // Hides disabled commands
            value: this.bot.commands.map(c => {
              if (db != undefined && db.disabledCmds != undefined && db.disabledCmds.includes(c.id)) return;
              if (c.category != category) return;
              return `\`${c.id}\``;
            }).join(" "),
          })),
          footer: {
            icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
            text: `${this.bot.commands.size - owneramt} commands loaded`,
          },
          color: require("../../utils/Colour")("general"),
        },
      }).catch(() => {
        // Sends the help command in the channel if the DM failed
        msg.channel.createMessage({
          embed: {
            fields: categories.map(category => ({
              name: sortedcategories[categories.indexOf(category)],
              value: this.bot.commands.map(c => {
                if (c.category != category) return;
                return `\`${c.id}\``;
              }).join(" "),
            })),
            footer: {
              icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
              text: `${this.bot.commands.size - owneramt} commands loaded`,
            },
            color: require("../../utils/Colour")("general"),
          },
        });
        return;
      });
      // Sends the message
      if (msg.channel instanceof Eris.PrivateChannel) return;
      if (dmson != undefined) msg.channel.createMessage(this.bot.embed("📚 Help", "I've sent a list of commands to you.", "general")).catch(() => {});
    } else {
      // Returns if the cmd's category is owner
      if (cmd.category == "Owner") return;
      msg.channel.createMessage({
        embed: {
          title: cmd.id,
          description: cmd.description,
          fields: [{
            name: "Category",
            value: cmd.category || "No category",
            inline: false,
          }, {
            // Alphabetically sorts aliases
            name: "Aliases",
            value: cmd.aliases.sort((a, b) => {
              let nameA = a.toLowerCase(),
                nameB = b.toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            }).map(alias => `\`${alias}\``).join(" ") || "No aliases",
            inline: false,
          }, {
            name: "Usage",
            value: cmd.usage || "No usage details",
            inline: false,
          }, {
            name: "Cooldown",
            value: cmd.cooldown != 0 ? `${(cmd.cooldown / 1000).toFixed(1)} seconds` : "No cooldown",
            inline: false,
          }, {
            name: "Required Permissions",
            value: cmd.requiredperms || "No required permissions",
            inline: false,
          }, {
            name: "Client Permissions",
            value: cmd.clientperms || "No client permissions",
            inline: false,
          }],
          color: require("../../utils/Colour")("general"),
        },
      }).catch(() => {});
    }
  }
}

module.exports = helpCommand;
