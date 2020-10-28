const Command = require("../../lib/Command");

class addassignableCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["addassign", "addassignablerole", "assignablerole", "makeassign", "makeassignable", "makeassignablerole"],
      description: "Sets a role to be self-assignable.",
      usage: "<role>",
      requiredperms: "manageRoles",
      staff: true
    });
  }

  async run(msg, args) {
    // Error handler if no arguments are given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Finds the role to set to be assignable
    const role = msg.channel.guild.roles.find(a => a.id == args.join(" ") || a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));

    // Handler if the role can't be found
    if (!role) return msg.channel.createMessage({
      embed: msg.errorembed("roleNotFound"),
    });

    // Inserts the role ID into the DB
    const assign = await this.db.table("assign").filter({
      id: role.id,
    });

    if (!assign.length) {
      // Inserts to the DB
      await this.db.table("assign").insert({
        guildid: msg.guild.id,
        id: role.id,
      });

      // Sends the embed & logs that it's assignable now
      this.bot.emit("assignableRoleAdd", msg.guild, msg.member, role);
      msg.channel.createMessage(this.bot.embed("✅ Success", `${role.name} is now an assignable role.`, "success"));
      // Handler for if the role is already in the DB
    } else {
      msg.channel.createMessage(this.bot.embed("❌ Error", `That role is already self-assignable.`, "error"));
    }
  }
}

module.exports = addassignableCommand;
