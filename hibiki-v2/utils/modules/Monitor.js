/*
  Hibiki Steammonitor Module

  This handles the steammonitor DMs & db.
*/

const fetch = require("node-fetch");
const config = require("../../config");

async function monitor(db, users) {
  let res;
  let bans = [];
  let ids = [];
  // Reads the DB
  let database = await db.table("steammonitor");

  database.forEach(async d => {
    // Deletes the entry from the db if its 3 days old
    if (new Date() - new Date(d.date) > 259200000) {
      await db.table("steammonitor").get(d.id).delete();
      return;
    }
    ids.push(d.id);
  });

  if (ids.length > 0) {
    // Fetches the API
    res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${config.steam}&steamids=${ids.join(",")}`);
    bans = await res.json().catch(() => {});
    if (bans) bans = bans.players
  } else return;

  // Returns if there's no bans
  if (!bans) return;

  // Gets the number of bans & their types
  bans.forEach(async b => {
    if (b.VACBanned || b.NumberOfGameBans > 0) {
      // Finds the user who is monitoring the banned user
      let user = await database.find(d => d.id == b.SteamId);
      // Deletes the user from the DB
      await db.table("steammonitor").get(b.SteamId).delete();
      try {
        // DMs the user about the ban
        users.find(u => user.uid == u.id).getDMChannel()
          .then(async dm => {
            await dm.createMessage({
              embed: {
                title: "🎮 Steam Monitor",
                color: require("../Colour")("error"),
                footer: {
                  text: `${user.uname} (${user.id}) has been ${b.VACBanned ? "VAC" : "game"} banned.`,
                  icon_url: user.pfp
                }
              }
            }).catch(() => {});
          });
      } catch (e) {}
    }
  });
}

module.exports = monitor;
