const Command = require("../../lib/Command");
const { snowflake } = require("../../lib/Snowflake");

class remindCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["remindme", "reminder", "reminders"],
      description: "Sends a reminder to you later on.",
      usage: "<time in s,m,h,d> <reminder> | <remove> <id>",
      cooldown: 5000,
      allowdms: true,
    });
    this.timeoutHandles = [];
  }

  async run(msg, args) {
    // Reminder time formatting
    function reminderTime(t, findDiff = false) {
      if (findDiff) t = t - new Date().getTime();
      const date = new Date(t);
      const days = date.getUTCDate() - 1,
        hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();
      let segments = [];
      if (days > 0) segments.push(`${days} day${days == 1 ? "" : "s"}`);
      if (hours > 0) segments.push(`${hours} hour${hours == 1 ? "" : "s"}`);
      if (minutes === 0 && seconds < 1) segments.push("less than a minute");
      if (minutes > 0) segments.push(`${minutes} minute${minutes == 1 ? "" : "s"}`);
      let dateString = segments.join(", ");
      if (!dateString) dateString = `${seconds} second${seconds == 1 ? "" : "s"}`;
      return dateString;
    }

    // If no args were given, list the user's redminders
    if (args[0] == undefined || args[0].toLowerCase() == "list") {
      let db = await this.bot.db.table("reminders");
      // Filters the db so only the current user is in the object
      db = db.filter(d => d.user == msg.author.id);
      // Handler for if the user has no reminders
      if (!db.length) return msg.channel.createMessage(this.bot.embed("⏰ Reminders", "You dont have any reminders.", "general"));

      // Sends the embed
      msg.channel.createMessage({
        embed: {
          title: "⏰ Reminders",
          fields: db.map(r => ({
            name: `${r.id}`,
            value: `${r.message} **(${reminderTime(r.date, true)})**`,
          })),
          color: require("../../utils/Colour")("general"),
        }
      });
      return;
    }

    // If the args start with remove, remove reminders
    if (args[0] != undefined && (args[0].toLowerCase() == "remove" || args[0].toLowerCase() == "delete")) {
      // Handler for if no args/ an invalid ID was given.
      if (!args[1] || !args[1].length) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided an invalid ID.", "error"));
      let db = await this.bot.db.table("reminders").get(args[1]);
      // Handler for if the reminder hasnt been created by the user
      if (db.user != msg.author.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "You didn't create that reminder.", "error"));
      // Reads the DB & deletes the reminder from it
      let reminder = await this.bot.db.table("reminders").get(args[1]).delete();
      // If the DB skipped, error
      if (reminder.skipped || reminder.errors) return msg.channel.createMessage(this.bot.embed("❌ Error", "Reminder not found.", "error"));
      // Clears the timeout if the handle is stored
      let handle = this.timeoutHandles.find(h => h.id == args[1]);
      if (handle) clearTimeout(handle);
      // Sends the embed
      return msg.channel.createMessage(this.bot.embed("⏰ Reminder", `Reminder removed.`, "general"));
    }

    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    let val = 0;
    let fargs = [...args];
    // Ugly arg parser
    args = args.join(" ").replace(/\d{1,2}( )?(w(eek(s)?)?)?(d(ay(s)?)?)?(h(our(s)?)?(r(s)?)?)?(m(inute(s)?)?(in(s)?)?)?(s(econd(s)?)?(ec(s)?)?)?( and( )?)?([, ]{1,2})?/gi, "").split(" ");
    // Time args
    let timeArg = fargs.join(" ").substring(0, fargs.join(" ").indexOf(args.join(" ")));
    timeArg.split("").forEach((char, i) => {
      if (isNaN(parseInt(char))) return;
      if (i == timeArg.length - 1) return;
      let v = timeArg[i + 1].toLowerCase();
      if (!isNaN(parseInt(timeArg[i + 1])) && !isNaN(parseInt(char))) return;
      if (!isNaN(parseInt(char)) && !isNaN(parseInt(timeArg[i - 1]))) char = `${timeArg[i - 1]}${char}`;
      if ((v == " " || v == ",") && /[wdhms]/.exec(timeArg[i + 2].toLowerCase())) v = timeArg[i + 2];
      // Case switcher
      if (isNaN(parseInt(v))) {
        switch (v) {
          case "w":
            val += char * 604800000;
            break;
          case "d":
            val += char * 86400000;
            break;
          case "h":
            val += char * 3600000;
            break;
          case "m":
            val += char * 60000;
            break;
          case "s":
            val += char * 1000;
            break;
        }
      }
    });
    // Handler for if the amount is 0
    if (val < 1000) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided an invalid amount of time.", "error"));
    // Final date
    let finaldate = new Date().getTime() + val;
    // Adjust for webhook latency
    finaldate += this.bot.shards.get(0).latency;
    // Returns if the amt of time is more than 24.8 days bigger
    if (finaldate > new Date().getTime() + 2142720000) return msg.channel.createMessage(this.bot.embed("❌ Error", "The time amout must be under 24.8 days.", "error"));
    // Sets the reminder
    let id = snowflake();
    let reminder = {
      id: id,
      date: finaldate,
      user: msg.author.id,
      message: args.join(" "),
    };

    // Pushes the reminder to the DB
    let rdb = await this.bot.db.table("reminders").insert(reminder);
    if (!rdb.errors) {
      // Sets timeout to send reminder
      let handle = setTimeout(async (r) => {
        let db = await this.bot.db.table("reminders").get(r.id);
        if (!db) return;
        let user = this.bot.users.get(r.user);
        if (!user) return;
        let dm = await user.getDMChannel();
        if (!dm) return;
        // Sends the reminder message in DMs
        await dm.createMessage({
          embed: {
            title: "⏰ Reminder",
            description: r.message,
            color: require("../../utils/Colour")("general"),
          }
        }).catch(() => {});
        this.timeoutHandles.push({ id: id, handle: handle });
        // Remove the reminder from the DB
        await this.bot.db.table("reminders").get(r.id).delete();
      }, reminder.date - new Date().getTime(), reminder);

      // Sends the embed
      msg.channel.createMessage({
        embed: {
          title: "⏰ Reminder",
          description: `I'll remind you to ${args.join(" ")} in ${reminderTime(finaldate, true)}.`,
          fields: [{
            name: "ID:",
            value: reminder.id,
          }],
          color: require("../../utils/Colour")("general"),
        }
      });
    } else {
      msg.channel.createMessage(this.bot.embed("❌ Error", "An error happened with the DB. Try again later.", "error"));
    }
  }
}

module.exports = remindCommand;
