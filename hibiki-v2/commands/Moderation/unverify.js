const Command = require("../../lib/Command");

class unverifyCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["deverify", "unapprove", "uv", "ut", "untrust"],
      description: "Removes the verified role from a user.",
      usage: "<@user>",
      clientperms: "manageRoles",
      requiredperms: "manageMessages",
      cooldown: 2000,
      staff: true,
    });
  }

  async run(msg, args) {
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == args[0] || `<@${m.id}>` === args[0] || `<@!${m.id}>` === args[0]);
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);

    // Sends if the user can't be found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Error handler for if the guildconfig doesn't exist
    if (!guildconfig) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the verified role yet. Run the setup command first.", "error"));
      return;
    }

    let role = await msg.channel.guild.roles.find(r => r.id == guildconfig.verified);

    // Error handler for if the role isn't set
    if (!role) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the verified role correctly yet. Run the setup command first.", "error"));
      return;
    }

    // Handler for if the user doesn't have the verified role
    if (!member.roles.includes(guildconfig.verified)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** doesn't have the verified role.`, "error"));
    } else {
      // Removes verified role
      try {
        // Tries to remove the role
        await member.removeRole(guildconfig.verified, `Unverify command ran by ${require("../../utils/Format").tag(msg.author)}`);
        // Logs to the logchannel
        this.bot.emit("memberUnverify", msg.guild, msg.member, member);
        // Sends the success embed
        msg.channel.createMessage(this.bot.embed("✅ Success", `I removed the verified role from **${member.username}**.`, "success"));
      } catch (e) {
        if (e) {
          // Error handler for anything else
          msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** doesn't have the verified role.`, "error"));
        }
      }
    }
  }
}
module.exports = unverifyCommand;
