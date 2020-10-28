const Command = require("../../lib/Command");

class assignCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["assignable", "giverole", "iam"],
      description: "Gives an assignable role.",
      usage: "<role>",
      clientperms: "manageRoles",
    });
  }

  async run(msg, args) {
    // Gives a list of assignable roles if no arguments are given
    if (!args.length) {
      let assignableRoles = (await this.db.table("assign").filter({ guildid: msg.guild.id })).map(r => {
        if (msg.guild.roles.has(r.id)) return `\`${msg.guild.roles.get(r.id).name}\``;
      });
      // Filters thru assignableRoles
      assignableRoles = assignableRoles.filter(r => r != undefined);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("📃 Assignable Roles", assignableRoles.join(", ") || "No assignable roles are added.", "general"));
    } else {
      // Checks if the role the user typed is a valid role
      const role = msg.channel.guild.roles.find(a => a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()) || a.name.toLowerCase().endsWith(args.join(" ").toLowerCase()));
      // Handler for if a role isn't found
      if (!role) return msg.channel.createMessage({
        embed: msg.errorembed("roleNotFound"),
      });

      // Handler for if the role isn't assignable
      const assignable = await this.db.table("assign").get(role.id);
      // Sends if the role isn't assignable
      if (!assignable) return msg.channel.createMessage(this.bot.embed("❌ Error", "That role isn't assignable.", "error"));
      // Handler for if the role isn't in the same guild
      if (assignable.guildid !== msg.guild.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "That role isn't assignable.", "error"));

      try {
        // Gives the user their role
        await msg.member.addRole(assignable.id, `Self-assigned role`);
        this.bot.emit("memberAssign", msg.guild, msg.member, role.name);
      } catch (e) {
        // Handler for if an error occured
        msg.channel.createMessage(this.bot.embed("❌ Error", "I couldn't give you that role.", "error"));
        return;
      }
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `You've been given the \`${role.name}\` role.`, "success"));
    }
  }
}

module.exports = assignCommand;
