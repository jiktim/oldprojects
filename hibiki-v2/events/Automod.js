/*
  Hibiki Automod Event

  This loads/handles each type of automod
  event. It also handles automod exceptions.
*/

const Eris = require("eris");
const Event = require("../lib/Event");

// Sets the Automod event
class automod extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageCreate",
    });
  }

  async run(msg) {
    // Return if its a DM
    if (msg.channel instanceof Eris.PrivateChannel) return;
    // Returns if invalid
    if (!msg.member) return;
    // Return if the author is a bot
    if (msg.bot) return;
    // Gets the guild ID
    let cfg = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // Returns if automod isnt setup
    if (!cfg) return;
    // If the member has the staff role or admin, manageguild, or managemessages permission, don't run
    if (msg.member && msg.member.roles && (cfg && cfg.staffrole && msg.member.roles.includes(cfg.staffrole) || msg.member.permission.has("administrator") || msg.member.permission.has("manageGuild") || msg.member.permission.has("manageMessages"))) return;
    // If antispam is setup properly
    if (cfg.AntiSpam && cfg.spamPunishments) await require("./automod/AntiSpam")(msg, this.bot, cfg);
    // If antiinvite is setup properly
    if (cfg.AntiInvite && cfg.invitePunishments) await require("./automod/AntiInvite")(msg, this.bot, cfg);
  }
}

module.exports = automod;
