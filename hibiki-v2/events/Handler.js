/*
  Hibiki Handler

  This handles bot commands, errors,
  custom commands, and command logging.
*/

const Event = require("../lib/Event");
const Eris = require("eris");
const Sentry = require("@sentry/node");
const format = require("../utils/Format");
const config = require("../config");

// Sets whether something is a guild or not
Object.defineProperty(Eris.Message.prototype, "guild", {
  get: function() { return this.channel.guild; },
});

// Sets the messageCreate event
class Handler extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageCreate",
    });
  }

  async run(msg) {
    // DM handler
    if (msg.channel instanceof Eris.PrivateChannel) {
      // Returns if author ID = bot id
      if (msg.author.id == this.bot.user.id) return;
      // Sends the help command if it was run in DMs
      let cmd = this.bot.commands.find(c => msg.content.toLowerCase().startsWith(`${this.bot.config.prefix}${c.id}`) || msg.content.toLowerCase().startsWith(c.id));
      if (cmd && cmd.allowdms) cmd.run(msg, msg.content.substring(this.bot.config.prefix.length + cmd.id.length + 1).split(" "));
      // Errors out if anything else was ran in DMs
      else if (cmd && !cmd.allowdms) msg.channel.createMessage(this.bot.embed("❌ Error", "This command can't be used in DMs. Try again in a server.", "error")).catch(() => {});
      // DM logging
      return this.bot.createMessage(this.bot.config.logchannel, {
        embed: {
          title: "💬 I was sent a DM.",
          description: `Content: ${msg.content}`,
          image: {
            url: msg.attachments.length != 0 ? msg.attachments[0].url : "",
          },
          footer: {
            text: `${format.tag(msg.author, false)} (${msg.author.id})`,
            icon_url: `${msg.author.avatarURL}`,
          },
          color: require("../utils/Colour")("general"),
        },
      }).catch(() => {});
    }

    // Blocks commands being triggered by other bots and itself
    if (msg.author.bot) return;

    // Looks for the specific guildconfig in the DB
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // Sets the prefixlength to null
    let prefixLength = null;
    // Checks to see if the prefix ia a valid prefix and if a command is a valid command
    if (msg.content.startsWith(this.bot.config.prefix) && (!guildconfig || !guildconfig.prefix)) prefixLength = this.bot.config.prefix.length;
    if (msg.content.startsWith(`<@${this.bot.user.id}>`) && !prefixLength) prefixLength = `<@${this.bot.user.id}> `.length;
    if (msg.content.startsWith(`<@!${this.bot.user.id}>`) && !prefixLength) prefixLength = `<@!${this.bot.user.id}> `.length;
    if (guildconfig && guildconfig.prefix && msg.content.startsWith(guildconfig.prefix) && !prefixLength) prefixLength = guildconfig.prefix.length;
    if (!prefixLength || prefixLength.length == 0) return;
    const [cmdName, ...args] = msg.content.slice(prefixLength).split(" ").map(s => s.trim());
    // Looks for the command
    const cmd = this.bot.commands.find(tempCmd => tempCmd.id === cmdName.toLowerCase() || tempCmd.aliases.includes(cmdName.toLowerCase()));

    // Custom command handler
    let customcmd;
    if (guildconfig != undefined && guildconfig.customCommands != undefined) {
      customcmd = guildconfig.customCommands.find(c => c.name == cmdName);
    }

    // Sends the embed
    if (customcmd != undefined && !cmd) {
      // Replaces "{mentioner}" with the personed mentioned when running the custom command
      if (msg.mentions && msg.mentions[0]) {
        customcmd.output = customcmd.output.replace(/{mentioner}/g, `<@${msg.mentions[0].id}>`);
      } else customcmd.output = customcmd.output.replace(/{mentioner}/g, `<@${msg.author.id}>`);
      // Replaces "{author}" with the person running the custom command
      customcmd.output = customcmd.output.replace(/{author}/g, `<@${msg.author.id}>`);
      // Replaces "{random}" with a random number between 0 and 100
      customcmd.output = customcmd.output.replace(/{random}/g, Math.floor(Math.random() * 100));
      // Replaces "{guild}" with the guild name
      customcmd.output = customcmd.output.replace(/{guild}/g, msg.guild.name);


      // Sends the custom command
      return msg.channel.createMessage({
        embed: {
          title: `✨ ${customcmd.name}`,
          description: customcmd.output.substring(0, 2048),
          image: {
            url: customcmd.image,
          },
          footer: {
            text: msg.guild.members.get(customcmd.createdBy) ? `Author: ${format.tag(msg.guild.members.get(customcmd.createdBy), false)}` : customcmd.name,
            icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
          },
          color: require("../utils/Colour")("general"),
        }
      });
    }

    // Returns if the command is invalid
    if (!cmd) return;

    // Blocks blacklisted users from running anything
    const blacklist = await this.bot.db.table("blacklist")

    if (blacklist.find(u => u.user == msg.author.id)) return;

    // Static error embeds
    msg.errorembed = (error) => {
      let errors = require("../lib/Constants").errors;
      let err = errors[error];
      return err;
    };

    // Sends if the bot lacks permission to embed
    if (!msg.channel.guild.members.get(this.bot.user.id).permission.has("embedLinks")) {
      msg.channel.createMessage("I don't have permission to embed messages/links. Be sure my role has the proper permissions.");
      return;
    }

    // Checks if a category is disabled in the DB
    if (guildconfig && (guildconfig.disabledCategories || []).includes(cmd.category) && cmd.allowdisable) return msg.channel.createMessage({
      embed: msg.errorembed("disabledCommand"),
    });

    // Checks if a command is disabled in the DB
    if (guildconfig && (guildconfig.disabledCmds || []).includes(cmd.id) && cmd.allowdisable) return msg.channel.createMessage({
      embed: msg.errorembed("disabledCommand"),
    });

    // Checks if a command is set to have a cooldown
    if (cmd.cooldown && !this.bot.config.owners.includes(msg.author.id)) {
      const cooldown = this.bot.cooldowns.get(cmd.id + msg.author.id);
      // Adds an emote to the message that triggered the command if a cooldown was hit
      if (cooldown) return await msg.addReaction("🕒").catch(() => {});
      // Sets the cooldown
      this.bot.cooldowns.set(cmd.id + msg.author.id, new Date());
      setTimeout(() => {
        this.bot.cooldowns.delete(cmd.id + msg.author.id);
      }, cmd.cooldown);
    }

    // If the command is marked as NSFW and is run in a non-NSFW channel, send this
    if (cmd.nsfw == true && (msg.channel.nsfw == false || msg.channel.nsfw == undefined)) return msg.channel.createMessage({
      embed: msg.errorembed("nsfwOnly"),
    });

    // Blocks non-owners from running owner-only commands
    if (cmd.owner == true && !this.bot.config.owners.includes(msg.author.id)) return;
    // Sends if the user doesn't have the staffrole
    if (!msg.member.permission.has("administrator") && cmd.staff == true && guildconfig != undefined && guildconfig.staffrole != undefined && !msg.member.roles.includes(guildconfig.staffrole)) return msg.channel.createMessage({
      embed: msg.errorembed("userNoPermission"),
    });

    // Sends if the user doesn't have the requiredPerms to run a command
    if (cmd.requiredperms != undefined && (!msg.member.permission.has(cmd.requiredperms) || !msg.member.permission.has("administrator")) && (!guildconfig || !guildconfig.staffrole)) return msg.channel.createMessage({
      embed: msg.errorembed("userNoPermission"),
    });

    // Sends if the bot user doesn't have the requiredPerms to run a command
    if (cmd.clientperms != undefined) {
      let missingPerms = [];
      // Gets the botperms
      let botPerms = msg.guild.members.get(this.bot.user.id).permission;
      if (typeof cmd.clientperms == "string" && !botPerms.has(cmd.clientperms)) {
        missingPerms.push(cmd.clientperms);
      } else if (typeof cmd.clientperms == "object") {
        cmd.clientperms.forEach(perm => {
          if (!botPerms.has(perm)) missingPerms.push(perm);
        });
      }
      // Sends if missing perms & has embed links
      if (missingPerms.length > 0) {
        if (botPerms.has("embedLinks")) {
          msg.channel.createMessage(this.bot.embed("❌ Error", `In order to run this command, I need the ${missingPerms.map(p => `\`${p}\``).join(",")} permission${missingPerms.length > 1 ? "s" : ""}.`, "error"));
        } else {
          // Fallback plaintext message
          return msg.channel.createMessage(`In order to run this command, I need the ${missingPerms.map(p => `\`${p}\``).join(",")} permission${missingPerms.length > 1 ? "s" : ""}.`);
        }
      }
    }

    try {
      // Sets the colours & info for logging to the console
      let logTime = `[${format.prettyDate(msg.timestamp, false)}]`.blue;
      let logCmd = cmdName.yellow;
      let logServer = `${msg.channel.guild.name} (${msg.guild.id})`.yellow;
      let logUser = `${format.tag(msg.author, false)} (${msg.author.id})`.yellow;
      let logArgs = `args: ${args}`.yellow;
      // Logging command module
      this.bot.logs.push({
        msg: `**${cmd.id}** by **${format.tag(msg.author, false)}** in **${msg.channel.guild.name}** ${args.length > 0 ? `with args: **${args.join(" ")}**` : ""}`,
        date: msg.timestamp,
      });
      // Logs when a command is run
      console.log(`${logTime} ${logCmd} in ${logServer} by ${logUser}${args.length > 0 ? ` with ${logArgs}` : ""}`);
      cmd.run(msg, args);
    } catch (e) {
      // Attempts to ingore missing permissions/access/REST errors
      if (e.message != undefined && !e.message.includes("Missing Permissions") && !e.message.includes("Missing Access") && !e.message.includes("DiscordRESTError")) {
        Sentry.configureScope(scope => {
          // Sets the sentry user info
          scope.setUser({ id: msg.author.id, username: format.tag(msg.author) });
          // Sets sentry guild name
          scope.setExtra("guild", msg.channel.guild.name);
        });

        let error = e;
        // Stupid way to prevent our Steam API key from being leaked by their rubbish API
        if (error && error.message) error.message = error.message.replace(config.steam, "");
        Sentry.captureException(error);
        msg.channel.createMessage(this.bot.embed("❌ Error", `An error occured and has been logged. \n \`\`\`js\n${error}\n\`\`\``, "error")).catch(() => {});
        console.error(e);
      } else {
        // console.error(e);
      }
    }
  }
}

module.exports = Handler;
