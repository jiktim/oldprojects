/*
  Hibiki Autorole Event

  This handles Autorole. It automatically adds the
  role set in the guildConfig to any new users that
  join, and excludes members who left after being muted.
*/

const Event = require("../lib/Event");

// Sets the Autorole event
class autorole extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberAdd"
    });
  }

  async run(guild, member) {
    // Reads the DB
    let db = await this.bot.db.table("guildconfig").get(guild.id);
    // Returns if there's no DB or if autorole isn't configured
    if (!db || !db.autorole) return;
    // Gets the mute db
    let mute = await this.bot.db.table("muteCache");
    // Gets the guild id
    mute = mute.find(m => m.member == member.id && m.guild == guild.id);
    // Don't add the autorole if the member is muted
    if (mute && db.muted) return;
    // Compatibility with the old way we handled autorole
    if (typeof db.autorole == "string") return member.addRole(db.autorole, "Role automatically given on join").catch(() => {});
    // Handler for multiple role
    db.autorole.forEach(role => {
      member.addRole(role, "Role automatically given on join").catch(() => {});
    });
  }
}

module.exports = autorole;
