const Command = require("../../lib/Command");

class agreeCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives the set agree role.",
      clientperms: "manageRoles",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Gets the guildconfig
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // If the guild hasn't setup anything
    if (!guildconfig) guildconfig = { id: msg.guild.id };
    // Returns if no agreeChannel is setup
    if (!guildconfig.agreeChannel) return;
    // Sets the agreeChannel
    const agreeChannel = await msg.channel.guild.channels.find(o => o.id === guildconfig.agreeChannel);
    // Returns if no agree channel is set
    if (!agreeChannel) return;
    // Checks if the channel id = agree channel
    if (msg.channel.id !== agreeChannel.id) return;
    // Looks for the agreerole
    const agreeRole = await msg.channel.guild.roles.find(o => o.id == guildconfig.agreeRole);
    // Stops running the command if the role isn't found
    if (agreeRole == undefined || !agreeRole) return;
    const memberRole = await msg.member.roles.includes(agreeRole.id);
    if (memberRole === true) return;
    // Adds the role and posts a message in chat if it doesnt have permission to
    let role = await msg.member.addRole(agreeRole.id, "Ran the agree command.").catch(() => {});
    // Deletes the message that triggered the command if the role was added
    if (role == undefined) return;
    msg.delete().catch(() => {});
  }
}

module.exports = agreeCommand;
