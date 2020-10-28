const Command = require("../../lib/Command");

class verifyCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["approve", "t", "trust", "v"],
      description: "Gives the verified role to to a user.",
      usage: "<@user>",
      clientperms: "manageRoles",
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  async run(msg, args) {
    // Looks for a valid user
    const member = msg.guild.members.find(m => m.id == args[0] || `<@${m.id}>` === args[0] || `<@!${m.id}>` === args[0]);
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);

    // Handler for if no valid member was found
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Error handler for if the guildconfig doesn't exist
    if (!guildconfig) return msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the verified role yet.", "error"));
    // Looks for the role
    let role = await msg.channel.guild.roles.find(r => r.id == guildconfig.verified);
    // Error handler for if the role isn't set
    if (!role) return msg.channel.createMessage(this.bot.embed("❌ Error", "You haven't set the verified role correctly yet.", "error"));
    // Handler for if the user already has the verified role
    if (member.roles.includes(guildconfig.verified)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${member.username}** is already verified/already has the verified role.`, "error"));
    } else {
      // Gives the user the verified role
      await member.addRole(guildconfig.verified, `Verified command ran by ${require("../../utils/Format").tag(msg.author)}`);
      // Logs to the logchannel
      this.bot.emit("memberVerify", msg.guild, msg.member, member);
      // Sends the success embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `I added the verified role to **${member.username}**.`, "success"));
    }
  }
}

module.exports = verifyCommand;
