const Eris = require("eris");
const fs = require("fs");

// Loads the token from the config file
let token = require("./cfg").token;

// Sets the shell options
let list = require("select-shell")({
  pointer: "> ",
  pointerColor: "white",
  checked: " ✓",
  unchecked: "",
  checkedColor: "cyan",
  multiSelect: false,
  inverse: true,
  prepend: false,
  disableInput: true
});

// Loads the colors module for better logging
require("colors");

// Sets the token as the one provided
let i = 0;
let user = token;

// Error handler for if no token is given
if (!token) {
  console.log(`${`[jDump Error]`.red} ${`No token was provided, exiting...`.cyan}`);
  process.exit();
}

// Logs into Discord using the token
let bot = new Eris(user);

// Handler for if the token is invalid
if (!bot) {
  console.log(`${`[jDump Error]`.red} ${`An invalid token was given, exiting...`.cyan}`);
  process.exit();
}

// Logs when jDump starts
console.log(`${`[jDump]`.yellow} ${`Starting jDump...`.cyan}`);

// Logs a list of guilds when ready
bot.on("ready", async () => {
  bot.guilds.forEach(e => {
    list.option(e.name, e.id);
  });

  // Asks the user which guild they'd like to dump
  console.log(`${`[jDump]`.yellow} ${`Which server would you like to dump messages from? To choose, select the server and press enter.`.cyan}`);

  // Creates the list using the list options
  list.list();

  // List selection handler
  list.on("select", async (opt) => {
    // Clears the original list
    list.clearList();
    // Clears the console
    console.clear();

    // Sets the second list's options
    let clist = require("select-shell")({
      pointer: "► ",
      pointerColor: "white",
      checked: " ◉",
      unchecked: "",
      checkedColor: "cyan",
      multiSelect: true,
      inverse: true,
      prepend: false,
      disableInput: true
    });

    // Gets the guild selected
    let guild = bot.guilds.get(opt[0].value);
    // Logs the guilds channels
    guild.channels.forEach(c => {
      // Returns if the channel type is a voice channel
      if (c.type != 0) return;
      // Sets the option to the name & id
      clist.option(`${c.name}`, c.id);
    });

    // Asks the user which channels they'd like to dump
    console.log(`${`[jDump]`.yellow} ${`Which channels would you like to dump? To choose, select the channel(s), and press the right arrow key.`.cyan}`);
    // Creates the list using the list options
    clist.list();

    // List selection handler
    clist.on("select", async opt => {
      // Exits if no channels were selected
      if (!opt.length) {
        console.log(`${`[jDump Error]`.red} ${`No valid channels were selected, exiting...`.cyan}`);
        process.exit();
      }

      // Maps each channel
      opt.forEach(async o => {
        let channel = guild.channels.get(o.value);
        // Makes the directory of the guild name
        if (!fs.existsSync(guild.name)) {
          fs.mkdirSync(`${guild.name}/`);
        }

        // Sets the time
        let time = new Date();
        // Gets the last million messages
        let msgs = await channel.getMessages(1000000).catch(() => {});

        // Handler for if there's no/invalid messages
        if (!msgs) {
          process.stdout.write(` No valid messages found, skipped dumping ${channel.name}...`.red);
          return;
        }

        // Logs while dumping the channel
        process.stdout.write(`[#${channel.name}]`.blue);
        // Writes the messages to a txt file in the proper directory
        fs.appendFileSync(`./${guild.name}/${channel.name}.txt`, `Dumped by jDump at ${new Date()}`);

        // Logs when the message request is finished
        process.stdout.write(` Message request finished, writing files...`.cyan);

        // Sets the write loop
        let write = 0;
        // Dumps each message
        msgs.forEach(msg => {
          write++;
          // if (write > msgs.length / 4) {
          //   process.stdout.write(`.`.cyan);
          //   write = 0;
          // }
          // Writes to each file
          fs.appendFileSync(`./${guild.name}/${channel.name}.txt`, `\n ${msg.author.username}#${msg.author.discriminator}: ${msg.content}`);
        });
        // Writes when finished dumping
        process.stdout.write(`${` Dumped in ${(new Date() - time) / 1000} seconds.`.green} ${` (${++i}/${opt.length}) complete\n`.yellow}`);
        time = 0;
        // // Clears the list
        // list.clearList();
        // // Clears the console
        // console.clear();
        // Logs when finished dumping
        // console.log(`${`[jDump]`.yellow} ${`Finished dumping selected channels, exiting...`.green}`);
        // process.exit();
      });
    });
  });
});

// Connects to Discord
bot.connect();
