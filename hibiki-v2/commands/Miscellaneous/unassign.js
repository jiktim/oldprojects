const Command = require("../../lib/Command");

class unassignCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["removerole", "iamnot"],
      description: "Removes a role that you assigned to yourself.",
      usage: "<role>",
      clientperms: "manageRoles",
    });
  }

  async run(msg, args) {
    // Returns list of assignable roles if no args were given
    if (!args.length) {
      msg.channel.createMessage({
        embed: {
          title: "📃 Unassign Roles",
          description: "Check the assignable roles using and then type unassign them.",
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Looks for the role
      const role = msg.channel.guild.roles.find(a => a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()) || a.name.toLowerCase().endsWith(args.join(" ").toLowerCase()));

      // Handler for if the role can't be found
      if (!role) return msg.channel.createMessage({
        embed: msg.errorembed("roleNotFound"),
      });

      // Assignable role checker
      const assignable = await this.db.table("assign").get(role.id);
      // if role isn't assignable
      if (!assignable) return msg.channel.createMessage(this.bot.embed("❌ Error", "That role isn't an assignable role.", "error"));
      // If role isn't in same guild
      if (assignable.guildid !== msg.guild.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "That role isn't an assignable role.", "error"));

      // Tries to remove the role
      try {
        await msg.member.removeRole(assignable.id, `Self-assigned role`);
        this.bot.emit("memberUnassign", msg.guild, msg.member, role.name);
      } catch (e) {
        // Sends an embed if removing the role failed
        msg.channel.createMessage(this.bot.embed("❌ Error", "I couldn't remove the role specified.", "error"));
        return;
      }
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `You have removed the \`${role.name}\` role from yourself.`, "success"));
    }
  }
}

module.exports = unassignCommand;
