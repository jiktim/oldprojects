const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const { abuseipdb, ipinfo, maps } = require("../../config");

class ipinfoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutip", "geolocation", "ip", "ipinformation"],
      description: "Displays info about an IP address.",
      usage: "<ip>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if the user gives arguments that aren't an integer
    if (args.find(arg => !parseInt(arg))) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided an invalid IP address.", "error"));
    // Handler for if no arguments are given
    if (!args.length) return msg.channel.createMessage(this.bot.embed("❌ Error", "You must provide an IP address to look up.", "error"));
    // Fetches the API
    let res = await fetch(`https://ipinfo.io/${encodeURIComponent(args.join(" "))}/json?token=${encodeURIComponent(ipinfo)}`);
    let body = await res.json().catch(() => {});
    // Fetches the IP abuse API
    res = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(args.join(" "))}`, { headers: { Key: abuseipdb, Accept: "application/json" } });
    let abuseInfo = await res.json().catch(() => {});

    // Handler for if the API returns an error
    if (body.error) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `${body.error.title.length ? body.error.title.replace("❌ Error", "Either you provided an invalid IP or nothing was found.") : "You provided an invalid IP address."} ${body.error.message.length ? body.error.message.replace("Please provide a valid IP address", "") : ""}`, "error"));
      return;
    }

    // Handler for if the API doesnt have required info
    if (!body.hostname && !body.org && !body.loc && !body.country && !body.city && !body.region) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `You provided an invalid IP address.`, "error"));
      return;
    }

    if (body) {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🌐 IP Information",
          description: "Not all information may be exact.",
          image: {
            url: `https://maps.googleapis.com/maps/api/staticmap?center=${body.loc}&zoom=10&size=250x150&sensor=false&key=${maps}` || "null",
          },
          fields: [{
            name: "Hostname",
            value: `${body.hostname || "Unknown"}`,
            inline: true,
          }, {
            name: "Org",
            value: `${body.org || "No Org"}`,
            inline: true,
          }, {
            name: "Location",
            value: `${body.loc || "Unknown Lat/Long"}`,
            inline: true,
          }, {
            name: "Country",
            value: `${body.country || "Unknown"}`,
            inline: true,
          }, {
            name: "City",
            value: `${body.city || "Unknown City"}`,
            inline: true,
          }, {
            name: "Region",
            value: `${body.region || "Unknown Region"}`,
            inline: true,
          }, {
            name: "Abuse Info",
            value: `${abuseInfo.data.totalReports} reports, ${abuseInfo.data.abuseConfidenceScore}/100 abuse score` || "Unknown",
            inline: true
          }],
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}


module.exports = ipinfoCommand;
