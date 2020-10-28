const Command = require("../../lib/Command");
const format = require("../../utils/Format");
const fetch = require("node-fetch");
const config = require("../../config");

class steamCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["steamaccount", "steaminfo", "steamuser"],
      description: "Displays info about a Steam account.",
      usage: "<account>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Sends if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sets static Steam things
    let steamid;
    let res;
    let profile;
    let bans;
    let games;
    let steamlvl;
    let description;

    // Vanity URL
    if (/^\d+$/.test(args[0])) steamid = args[0];
    else if (args.join(" ").startsWith("https://steamcommunity.com/id/")) args[0] = args.join(" ").substring(`https://steamcommunity.com/id/`.length, args.join(" ").length);
    if (!steamid) {
      // Fetches the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.steam}&vanityurl=${encodeURIComponent(args[0])}`);
      let id = await res.json().catch(() => {});
      // Handler for if the user isn't found or something happened
      if (!id || id.response.success !== 1) return msg.channel.createMessage({
        embed: msg.errorembed("userNotFound"),
      });
      steamid = id.response.steamid;
    }

    // Sends the original message
    let editmsg = await msg.channel.createMessage(this.bot.embed("🎮 Steam", "Waiting for a response from the Steam API...", "general"));
    try {
      // Contacts the playerSummaries part of the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steam}&steamids=${steamid}`);
      profile = await res.json();
      profile = profile.response.players[0];
      // Contacts the playerBans part of the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${config.steam}&steamids=${steamid}`);
      bans = await res.json();
      bans = bans.players[0];
      // Contacts the ownedGames part of the API
      res = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamid}&include_appinfo=1&include_played_free_games=1&key=${config.steam}`);
      games = await res.json();
      games = games.response;
      // Contacts the steamLevel part of the API
      res = await fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?steamid=${steamid}&key=${config.steam}`);
      steamlvl = await res.json();
      steamlvl = steamlvl.response.player_level;
      // Gets the profile's description thru a different mean (API doesn't support it)
      res = await fetch(`http://steamcommunity.com/profiles/${steamid}`);
      description = await res.text();
      // Looks for the div class - might need to update this one day
      description = /<div class="profile_summary">[\s\n]{0,}([\w\d\s;_\-,.]{0,512})<\/div>/.exec(description);
      description = description[1];
      // Default description
      if (!description || description == "No information given.") description = null;
      if (description && description.length > 256) description = `${description.substring(0, 256)}...`;
    } catch (err) {}

    // Handler for if the API returns garbage/invalid stuff
    if (!profile || !bans || !games) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Makes the user statuses look better
    if (profile.personastate === 0) profile.personastate = "Offline/Invisible";
    if (profile.personastate === 1) profile.personastate = "Online";
    if (profile.personastate === 2) profile.personastate = "Busy";
    if (profile.personastate === 3) profile.personastate = "Away";
    if (profile.personastate === 4) profile.personastate = "Snooze";
    if (profile.personastate === 5) profile.personastate = "Looking to trade";
    if (profile.personastate === 6) profile.personastate = "Looking to play";

    // Fields construct
    let fieldsConstruct = [{
      name: "Steam ID",
      value: profile.steamid,
      inline: true,
    }, {
      name: "Display Name",
      value: profile.personaname,
      inline: true,
    }, {
      name: "Visibility",
      value: profile.personastate || "Private",
      inline: true,
    }, {
      name: "Playing",
      value: `${profile.gameid ? games.games.find(game => game.appid == profile.gameid).name : "None/Private"}`,
      inline: true,
    }, {
      name: "Games Owned",
      value: games.game_count || "Private",
      inline: true,
    }, {
      name: "Level",
      value: steamlvl || "0/Private",
      inline: true,
    }, {
      name: "Creation Date",
      value: profile.timecreated ? format.prettyDate(profile.timecreated * 1000) : "Unknown",
      inline: true,
    }, {
      name: "Last Offline",
      value: profile.lastlogoff != undefined ? `${format.dateParse(new Date() / 1000 - profile.lastlogoff)} ago` : "Unknown",
      inline: true,
    }, ];

    // Embeds if the user has set a country on their profile
    if (profile.loccountrycode) {
      fieldsConstruct.push({
        name: "Country",
        value: `:flag_${profile.loccountrycode.toLowerCase()}:` || "Unknown",
        inline: true,
      });
    }

    // Embeds if the user has set their real name on their profile
    if (profile.realname) {
      fieldsConstruct.push({
        name: "Real Name",
        value: profile.realname,
        inline: true,
      });
    }

    // Empty banstring
    let banstring = "";
    // Construct for ban fields
    if (bans.NumberOfVACBans > 0 || bans.NumberOfGameBans > 0 || bans.EconomyBan != "none") {
      if (bans.NumberOfVACBans > 0) banstring += `✅ ${bans.NumberOfVACBans} VAC Ban${bans.NumberOfVACBans > 1 ? "s" : ""}\n`;
      else banstring += "❌ 0 VAC Bans\n";
      if (bans.NumberOfGameBans > 0) banstring += `✅ ${bans.NumberOfGameBans} Game Ban${bans.NumberOfGameBans > 1 ? "s" : ""}\n`;
      else banstring += "❌ 0 Game Bans\n";
      if (bans.EconomyBan != "none") banstring += `✅ Trade ban status: ${bans.EconomyBan}\n`;
      else banstring += "❌ Not trade banned\n";
    }

    // Pushes the ban string
    if (banstring.length) fieldsConstruct.push({
      name: "Ban Status",
      value: banstring,
      inline: false,
    });

    // Sends the embed
    editmsg.edit({
      embed: {
        description: description,
        title: `${profile.personaname || "Unknown"}`,
        fields: fieldsConstruct,
        thumbnail: {
          url: profile.avatarfull,
        },
        // Steam's accent colour
        color: 0x66c0f4,
      },
    });
  }
}

module.exports = steamCommand;
