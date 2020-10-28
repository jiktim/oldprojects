/*
  Hibiki Antiinvite Module

  This module looks for Discord invites and
  applies a punishment set by the server's staff.
*/

const punish = require("./Punishments");

module.exports = async (msg, bot, cfg) => {
  // Discord invite regex
  if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|list)|discordapp\.com\/invite)\/.+[a-z]/.test(msg.content)) {
    let strikeID;
    // Looks for each type of punishment
    cfg.invitePunishments.forEach(async punishment => {
      // Strikes the user with the reason
      if (punishment == "Strike") strikeID = await punish.strike(msg, bot, "Sent an invite (Automod)");
      // Deletes the messages
      if (punishment == "Purge") msg.delete();
      // Mutes the user
      if (punishment == "Mute") punish.mute(msg, bot, cfg);
    });

    // If msgOnPunishment is on
    if (cfg.msgOnPunishment) {
      let pmsg = await msg.channel.createMessage(bot.embed(`⚠️ Automod`, "You can't post invites here.", "error"));
      setTimeout(() => pmsg.delete("AutoMod message deletion").catch(() => {}), 4000);
    }

    // Sends to the logchannel & adds the role
    bot.emit("automodantiInvite", msg.guild, msg.member, msg.content, strikeID);
    await msg.member.addRole(cfg.muted, "AutoMod").catch(() => {});
  }
};
