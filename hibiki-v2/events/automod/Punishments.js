/*
  Hibiki Punishments Module

  This module handles punishment
  types that automod supports.
*/

const { snowflake } = require("../../lib/Snowflake");

module.exports.mute = async (msg, bot, cfg, reason) => {
  let member = msg.member;
  let guild = msg.guild;
  // Returns if the user is already muted
  if (member.roles && member.roles.includes(cfg.muted)) return;
  // Inserts the user's info into the muteCache
  await bot.db.table("muteCache").insert({
    role: "0",
    member: member.id,
    guild: guild.id,
  });

  // Insert's the user's roles into the muteCache
  await member.roles.forEach(async role => {
    await bot.db.table("muteCache").insert({
      role: role,
      member: member.id,
      guild: guild.id,
    });
    // Tries to remove their previous roles to ensure the mute
    await guild.removeMemberRole(member.id, role, "AutoMod").catch(() => {});
  });

  // Adds the muted role to the user & logs it to the audit logs
  await member.addRole(cfg.muted, "AutoMod").catch(() => {});
  if (reason) bot.emit("automodMute", guild, member, reason);
};

// Purge
module.exports.purge = async (m, msgs) => {
  if (Array.isArray(msgs)) m.channel.deleteMessages(msgs).catch(() => {});
  else m.channel.deleteMessage(msgs).catch(() => {});
};

module.exports.strike = async (msg, bot, reason) => {
  const id = snowflake();
  // Inserts data into the DB
  await bot.db.table("strikes").insert({
    giverId: bot.user.id,
    receiverId: msg.author.id,
    guildId: msg.guild.id,
    id: id,
    reason: reason || "Automod",
  });

  return id;
};
