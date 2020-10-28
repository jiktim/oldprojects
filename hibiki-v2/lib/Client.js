/*
  Hibiki Client

  Handles loading commands, events, etc.
*/

const { Client, Collection } = require("eris");
const { readdirSync, readdir } = require("fs");
const Command = require("./Command");
const Event = require("./Event");
const format = require("../utils/Format");
const config = require("../config");
const Sentry = require("@sentry/node");
const startTime = new Date();

// Requires colors for pretty logging
require("colors");

class HibikiClient extends Client {
  // Client constructor
  constructor(token, options, clientConfig, db) {
    super(token, options);
    this.db = db;
    this.cooldowns = new Map();
    this.config = clientConfig;
    this.commands = new Collection(Command);
    this.events = new Collection(Event);
    this.logs = [];
    this.antiSpam = [];
    this.snipeData = {};
    this.invitecache = {};
    this.embed = require("../utils/Embed");

    try {
      Sentry.init({ sentry: config.sentry });
    } catch (err) {
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`An error occured while configuring Sentry. Error: ${err.message}`.red}`);
    }
  }

  // Sets the location for the events folder and loads each event
  async loadEvents(location) {
    // Sets the location that the events load in
    location = `${process.cwd()}/${location}`;
    // Reads the directory set
    const items = readdirSync(location);
    // Loads each item
    items.forEach(async item => {
      // Prevents loading automod events
      if (item == "automod") return;
      // Tries to load each event
      let event;
      try {
        event = require(`${location}/${item}`);
      } catch (e) {
        // Captures errors & sends them to Sentry
        Sentry.captureException(e);
        // Logs to the console if an error happened while loading an Event
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Error while loading ${item} (Event): \n${e}`.red}`);
      }
      // Loads the events
      this.events.add(new event(this, this.db, item.match(/(.+)\.js$/)[1].toLowerCase()));
      const currentEvent = this.events.get(item.match(/(.+)\.js$/)[1].toLowerCase());
      this.on(currentEvent.name, (arg1, arg2, arg3, arg4, arg5) => currentEvent.run(arg1, arg2, arg3, arg4, arg5));
      // Logs to the console when each Event loads
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Loaded ${currentEvent.id} (Event)`.green}`);
    });

    this.once("ready", async () => {
      // Configures Sentry to the DSN - 5/10 ok comment
      try {
        Sentry.init({ dsn: config.sentry });
      } catch (err) {
        // Logs if Sentry couldn't configure - 0/10 i dont think this returns errors but ok
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`An error occured while configuring Sentry. Error: ${err.message}`.red}`);
      }

      // Don't try to start the webserver if the bot has been running for more than 20s
      if (process.uptime() < 20) {
        // Loads the Voting webserver
        if (config.votingRewards && config.votingRewards.port) await require("../lib/Voting")(this, config.votingRewards.port);
        // Loads the main webserver
        require("../web/index")(this);
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Dashboard loaded on`.green} ${`0.0.0.0:${config.dashboard.port}`.bold.green}`.green);
      } else {
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Web modules weren't loaded`.yellow}`);
      }

      // Loads the Monitor module
      let Monitor = require("../utils/modules/Monitor");
      // Loads the reminders
      require("../utils/modules/Reminders").loadAll(this);
      // Checks the accounts in the steammonitor db every 30 mins
      setInterval(Monitor, 1800000, this.db, this.users);
      // Public command count
      let owneramt = 0;
      // Sets the user amount
      let useramnt = 0;
      this.guilds.forEach(g => { useramnt += g.memberCount; });
      // Sets the # of owner commands
      this.commands.forEach(cmd => cmd.category == "Owner" ? owneramt++ : null);
      // Logs to the console when an event is added, how many commands have been loaded, how long it took to start up and what account it's currently logged into
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`${this.commands.size} commands loaded, ${owneramt} of which are owner commands.`.yellow}`);
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`It took ${new Date(new Date() - startTime).getSeconds()}.${new Date(new Date() - startTime).getMilliseconds()} seconds to start & connect to Discord.`.yellow}`);
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Logged in as ${this.user.username}#${this.user.discriminator} (${this.user.id}), serving ${this.guilds.size} guilds & ${useramnt} users.`.yellow}`);
      // Sets the playing status to the default one
      this.editStatus("online", { name: `${this.guilds.size} servers`, url: "https://twitch.tv/.", type: 3 });
      let type = 0;
      // Sets the playing status to an array of statuses
      setInterval(() => {
        let statuses = [`${this.guilds.size} servers`, `${useramnt} users`, `${this.logs.filter(log => new Date() - log.date <= 3600000 * 24).length} daily commands`];
        if (statuses.length <= type) type = 0;
        this.editStatus("online", { name: statuses[type], url: "https://twitch.tv/.", type: 3 });
        type++;
        // Delay of 50 seconds to avoid ratelimits
      }, 50000);
    });
  }

  // Command loader
  async loadCommands(location) {
    // Sets the location that the commands load in
    location = `${process.cwd()}/${location}`;
    // Reads each item
    let items = readdirSync(location, { withFileTypes: true });

    // Sorts the categories alphabetically
    items = items.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    // If no commands are found, warn in console
    if (!items) return console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${"No commands were loaded.".yellow}`);


    // Gets the exact command file and loads it
    items.forEach(async item => {
      // Returns if the item isn't a directory
      if (!item.isDirectory()) return;
      // Reads the files
      readdir(`${location}/${item.name}`, { withFileTypes: true }, (e, cmdfiles) => {
        // Sorts the command files alphabetically
        cmdfiles = cmdfiles.sort((a, b) => {
          if (a.name < b.name) return -1;
          else return 1;
        });

        // Attempts to load each command
        cmdfiles.forEach(f => {
          let command;
          try {
            command = require(`${location}/${item.name}/${f.name}`);
            if (!(command.prototype instanceof Command)) return;
            this.commands.add(new command(this, this.db, f.name.match(/(.+)\.js$/)[1].toLowerCase(), item.name));
            // Logs to the console when a command is loaded
            console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Loaded ${item.name}/${f.name}`.green}`);
            // If something errors when loading a command, log it to the console
          } catch (err) {
            Sentry.captureException(e);
            console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Error while loading ${f.name}: ${err}`.red}`);
          }
        });
      });
    });
  }
}

module.exports = HibikiClient;
