const Command = require("../../lib/Command");
const format = require("../../utils/Format");

class roleinfoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutrole", "role", "rinfo"],
      description: "Returns info about a role.",
      usage: "<role ID>",
    });
  }

  run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Finds the role
    let role = msg.channel.guild.roles.find(r => {
      if (r.id == args.join(" ")) return r;
      if (args.join(" ") == `<@&${r.id}>`) return r;
      if (r.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) return r;
    });

    // Handler for if the role is invalid or can't be found
    if (!role) return msg.channel.createMessage({
      embed: msg.errorembed("roleNotFound"),
    });

    // Checks how many members have the role
    let mems = 0;
    msg.channel.guild.members.forEach(m => {
      if (m.roles.includes(role.id)) mems++;
    });

    // Role settings
    let settings = [];
    if (role.mentionable) settings.push("Mentionable");
    if (role.hoist) settings.push("Hoisted");
    if (role.managed) settings.push("Managed by an integration");

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `📗 Info for the ${role.name} role`,
        fields: [{
          name: "About",
          value: `${role.name} (${role.id})`,
          inline: false,
        }, {
          name: "Colour",
          value: `#${role.color.toString(16)}`,
          inline: false,
        }, {
          name: "Settings",
          value: `${settings.join(", ") || "Unknown"}`,
          inline: false,
        }, {
          name: "Creation Date",
          value: `${format.prettyDate(role.createdAt)} (${format.dateParse(new Date() / 1000 - role.createdAt / 1000)} ago).`,
          inline: false,
        }, {
          name: "Other Info",
          value: `${mems} members have this role, and it's in position ${role.position}`,
          inline: false,
        }],
        color: role.color == 0 ? require("../../utils/Colour")("general") : role.color,
      },
    });
  }
}

module.exports = roleinfoCommand;
