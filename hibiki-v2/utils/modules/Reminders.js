/*
  Hibiki Reminders Module

  This loads reminders from the DB and handles
  DMing the user ASAP if the reminder passed while Hibiki was offline.
*/

module.exports.loadAll = async (bot) => {
  // Reads the DB
  let reminderdb = await bot.db.table("reminders");
  // Loads all reminders
  reminderdb.forEach(rd => {
    // Sets a timeout for reminders
    setTimeout(async (r) => {
      // Gets the reminders table
      let db = await bot.db.table("reminders").get(r.id);
      // If no table is found
      if (!db) return;
      // Gets the users
      let user = bot.users.get(r.user);
      // If no users are found
      if (!user) return;
      // Gets the user's DM channel
      let dm = await user.getDMChannel();
      // If no DM channel is found
      if (!dm) return;
      // Sends the reminder message
      await dm.createMessage({
        embed: {
          title: "⏰ Reminder",
          description: r.message,
          color: require("../Colour")("general"),
        }
      }).catch(() => {});
      // Removes the reminder from the db
      await bot.db.table("reminders").get(r.id).delete();
    }, rd.date - new Date(), rd);
  });
};
