const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class npmCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["node", "packages", "yarn"],
      description: "Searches for a package on NPM.",
      usage: "<package>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Fetches the API
    const res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(args.join(" ").toLowerCase())}`);
    const result = await res.json();

    // Handler for if nothing was found or an error occured
    if (result.error != undefined || !result["dist-tags"]) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Gets the results
    const pkg = result.versions[result["dist-tags"].latest];

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `${msg.content.includes("yarn") ? "🧶" : "📦"} ${pkg.name}`,
        description: pkg.description,
        fields: [{
          name: "Keywords",
          value: pkg.keywords != undefined && pkg.keywords.length > 0 ? `${pkg.keywords.map(k => `\`${k}\``).join(", ")}` : "None",
          inline: false,
        }, {
          name: "Link",
          value: `[https://www.${msg.content.includes("yarn") ? "yarnpkg" : "npmjs"}.com/package/${args.join(" ").toLowerCase()}](https://www.${msg.content.includes("yarn") ? "yarnpkg" : "npmjs"}.com/package/${args.join(" ").toLowerCase()})`,
          inlune: true,
        }, {
          name: "Latest Version",
          value: result["dist-tags"].latest,
          inline: true,
        }, {
          name: "License",
          value: result.license || "None",
          inline: true,
        }, {
          name: "Authors",
          value: pkg.maintainers.length > 0 ? pkg.maintainers.map(m => `\`${m.name}\``).join(", ") : "None",
          inline: true,
        }],
        color: msg.content.includes("yarn") ? 0x2c8ebb : 0xcc3534,
      }
    });
  }
}

module.exports = npmCommand;
