/*
  Hibiki AntiSpam Module

  This module attempts to detect message spam and prevents
  it using the punishment set by the server's staff.
*/

const punish = require("./Punishments");

module.exports = async (msg, bot, cfg) => {
  let spam = bot.antiSpam.filter(s => s.guild == msg.guild.id && s.id == msg.author.id && new Date().getTime() - s.date < 2500);
  // If the spam spam threshold isnt set default to 6
  if (!cfg.spamThreshold) cfg.spamThreshold = 6;

  // If the spam threshold is met
  if (spam.length >= cfg.spamThreshold) {
    cfg.spamPunishments.forEach(async punishment => {
      // Mutes the user if the punishment is set
      if (punishment == "Mute") punish.mute(msg, bot, cfg, spam);
      // Purges the spammy messages
      if (punishment == "Purge") punish.purge(msg, bot.antiSpam.filter(s => s.guild == msg.guild.id && s.id == msg.author.id && new Date().getTime() - s.date < 10000).map(s => s.msgid)).catch(() => {});
      // Strikes the user
      if (punishment == "Strike") punish.strike(msg, bot, "Spam (Automod)");
      // Sends a message saying the user got punished if msgOnPunishment is enabled
      if (cfg.msgOnPunishment) {
        let pmsg = await msg.channel.createMessage(bot.embed(`🔨 ${msg.author.username} has been ${cfg.spamPunishments.map(p => `${p.toLowerCase()}d`).filter(p => p != "purged").join(" and ")} for spamming.`, null, "error"));
        setTimeout(() => pmsg.delete("AutoMod message deletion").catch(() => {}), 4000);
      }
    });

    // Antispam
    bot.antiSpam.forEach(a => {
      // Returns if authors or guilds aren't the same
      if (a.id != msg.author.id) return;
      if (a.guild != msg.guild.id) return;
      bot.antiSpam.splice(bot.antiSpam.indexOf(a), 1);
    });
  }

  // Pushes the antispam
  bot.antiSpam.push({
    date: new Date().getTime(),
    id: msg.author.id,
    guild: msg.guild.id,
    content: msg.content,
    msgid: msg.id,
  });
};
