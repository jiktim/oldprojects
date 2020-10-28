const Command = require("../../lib/Command");
const hierarchy = require("../../utils/Hierarchy");

class muteCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["m", "shutup", "silence"],
      description: "Mutes a user.",
      usage: "<@user>",
      clientperms: "manageRoles",
      requiredperms: "manageMessages",
      cooldown: 2000,
      staff: true,
    });
  }

  async run(msg, [user, ...reason]) {
    // Handler if the user is invalid or can't be found
    if (!user) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sets the reason
    if (reason.length) reason = reason.join(" ");
    else reason = "No reason provided";
    // Looks for a valid member
    const member = msg.guild.members.find(m => m.id == user || `<@${m.id}>` === user || `<@!${m.id}>` === user || m.username.toLowerCase() == user.toLowerCase());
    // Reads the DB
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);

    // Handler if the user is invalid or can't be found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Prevents muting the bot
    if (member.id == this.bot.user.id) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "D-dont mute m-me... >w<", "error"));
      return;
    }

    // Handler if the guild has no data in the guildConfig table
    if (!guildconfig) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the muted role yet. Run the setup command first.", "error"));
      return;
    }

    // Searches for the muted role in the DB
    let role = await msg.channel.guild.roles.find(r => r.id == guildconfig.muted);

    // Handler if the muted role isn't found or is invalid
    if (!role) {
      msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the muted role correctly yet. Run the setup command first.", "error"));
      return;
    }

    // Handler for if the user's role is higher than the bot's
    if (hierarchy(member, msg.channel.guild.members.get(this.bot.user.id))) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `My role isnt high enough to mute **${member.username}**.`, "error"));
      return;
    }

    // Handler for if the member already has the muted role
    if (member.roles.includes(role.id)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** is already muted/already has the muted role.`, "error"));
      // Inserts the muted user & their previous roles into the muteCache table
    } else if (hierarchy(msg.member, member)) {
      await this.db.table("muteCache").insert({
        role: "0",
        member: member.id,
        guild: msg.guild.id,
      });
      await member.roles.forEach(async roles => {
        await this.db.table("muteCache").insert({
          role: roles,
          member: member.id,
          guild: msg.guild.id,
        });
        // Tries to remove their previous roles to ensure the mute
        await msg.channel.guild.removeMemberRole(member.id, roles, `Mute ran by ${require("../../utils/Format").tag(msg.author)} for: ${reason.substring(128)}`).catch(() => {});
      });
      // Adds the muted role to the user & logs it to the audit logs
      await member.addRole(guildconfig.muted, `${require("../../utils/Format").tag(msg.author)} ran the mute command`).catch(() => {
        msg.channel.createMessage(this.bot.embed("❌ Error", "Failed to add the muted role.", "error"));
      });
      // Posts to the logging channel
      this.bot.emit("memberMute", msg.guild, msg.member, member, reason);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `**${member.username}** was muted.`, "success"));
    } else {
      // Handler if the user doesn't have permission
      msg.channel.createMessage(this.bot.embed("❌ Error", `Your role is not high enough to do this.`, "error"));
    }
  }
}

module.exports = muteCommand;
