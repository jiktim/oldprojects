const Command = require("../../lib/Command");

class unmuteCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["um", "unsilence"],
      description: "Unmutes a user.",
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

    // Sends if a member couldn't be found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Error handler for if the guildconfig doesn't exist
    if (!guildconfig) return msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the muted role yet. Run the setup command first.", "error"));
    // Looks for the role
    let role = await msg.channel.guild.roles.find(r => r.id == guildconfig.muted);
    // Error handler for if the role isn't set
    if (!role) return msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the muted role yet.", "error"));

    // Handler for if the user doesn't have the muted role
    let userroles = await member.roles;
    if (userroles.includes(guildconfig.muted) === false) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** is not muted.`, "error"));
    } else {
      try {
        // Looks thru the muteCache
        let cache = await this.db.table("muteCache").filter({
          member: member.id,
          guild: msg.guild.id,
        });

        // Removes the muted rople
        await member.removeRole(guildconfig.muted, `${require("../../utils/Format").tag(msg.author)} unmuted`).catch(() => {
          // Sends the embed if an error happened
          msg.channel.createMessage(this.bot.embed("❌ Error", `I wasn't able to remove the muted role from the user.`, "error"));
          return;
        });

        // Readds the original roles
        cache.forEach(async roles => {
          if (roles == "0") return;
          await msg.channel.guild.addMemberRole(member.id, roles.role, `Unmute ran by ${require("../../utils/Format").tag(msg.author)}`).catch(() => {});
        });

        // Posts to the logging channel
        this.bot.emit("memberUnmute", msg.guild, msg.member, member);
        // Sends the embed
        msg.channel.createMessage(this.bot.embed("✅ Success", `**${member.username}** was unmuted.`, "success"));
        // Deletes the entry from the DB
        await this.db.table("muteCache").filter({ member: member.id, guild: msg.guild.id }).delete();
      } catch (e) {
        if (e) {
          // Error handler for anything else
          msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** is not muted.`, "error"));
        }
      }
    }
  }
}

module.exports = unmuteCommand;
