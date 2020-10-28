const Command = require("../../lib/Command");

class rmassignableCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["removeassign", "removeassignable", "removeassignablerole", "rmassign", "unassignablerole"],
      description: "Makes a previously assignable role unassignable.",
      usage: "<role>",
      requiredperms: "manageRoles",
      staff: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args[0]) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Checks if the role can be found
    const role = msg.channel.guild.roles.find(a => a.id == args.join(" ") || a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
    // Handler if the role can't be found
    if (!role) return msg.channel.createMessage({
      embed: msg.errorembed("roleNotFound"),
    });

    // Reads the DB
    const assign = await this.db.table("assign").filter({
      id: role.id,
    });

    // Removes info from Db
    if (assign.length !== 0) {
      await this.db.table("assign").filter({
        guildid: msg.guild.id,
        id: role.id,
      }).delete();
      // Logs to the logchannel
      this.bot.emit("assignableRoleRemove", msg.guild, msg.member, role);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `${role.name} is no longer an assignable role.`, "success"));
    } else {
      // Sends the embed if the role can't be found
      msg.channel.createMessage(this.bot.embed("❌ Error", `Either that role isn't set to be assignable or can't be found.`, "error"));
    }
  }
}

module.exports = rmassignableCommand;
