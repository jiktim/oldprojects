/*
  Hibiki Ask Utility

  This handles things such as asking for yes or no,
  and also handles various things in setup/automod.
*/

const timeout = require("../utils/Timeout");

module.exports = {
  YesNo: async (bot, msg, retMsg = false) => {
    try {
      // Sets the response message, timeout is 15 seconds
      const [resp] = await timeout("messageCreate", 15000, m => {
        // Returns if author/channel is invalid
        if (m.author.id != msg.author.id) return false;
        if (m.channel.id != msg.channel.id) return false;
        // Checks for a response of yes/no
        if (m.content.toLowerCase() != "y" && m.content.toLowerCase() != "yes" && m.content.toLowerCase() != "n" && m.content.toLowerCase() != "no") return false;
        return true;
      }, bot);
      // Checks for a response of yes
      if (resp.content.toLowerCase() === "y" || resp.content.toLowerCase() === "yes") {
        return retMsg ? {
          response: true,
          msg: resp,
        } : true;
      }
      // Returns
      return retMsg ? {
        response: false,
        msg: resp,
      } : false;
    } catch (_) {
      return retMsg ? {
        response: false,
        msg: null,
      } : false;
    }
  },

  For: (type, arg, guild) => {
    // Handler for if no type/arg/guild is given
    if (!type) return "No type";
    if (!arg) return "No arg";
    if (!guild) return "No guild";
    let clear = arg.toLowerCase() == "clear" || arg.toLowerCase() == "off" || arg.toLowerCase() == "null";
    // Searches for a valid roleID if the type is roleID
    if (type == "roleID") {
      if (clear) return "clear";
      let role = guild.roles.find(r => r.name.toLowerCase().startsWith(arg.toLowerCase()) || r.id == arg || arg == `<@&${r.id}>`);
      // Returns if no role is found
      if (!role) return "No role";
      return role.id;
    }

    // Searches for a valid channelID if the type is channelID
    if (type == "channelID") {
      if (clear) return "clear";
      let channel = guild.channels.find(r => (r.name.toLowerCase().startsWith(arg.toLowerCase()) || r.id == arg || arg == `<#${r.id}>`) && r.type == 0);
      // Returns if it's an invalid channel
      if (!channel) return;
      return channel.id;
    }

    // Searches for a valid integer if the type is number
    if (type == "number") {
      if (clear) return "clear";
      if (isNaN(arg)) return "No number";
      return arg;
    }

    // Searches for a valid string if the type is string
    if (type == "string") {
      if (clear) return "clear";
      // Returns if no number is found
      if (!arg) return "No string";
      return arg;
    }

    // Searches for a valid bool
    if (type == "bool") {
      if (arg.toLowerCase() == "true" ||
        arg.toLowerCase() == "yes" ||
        arg.toLowerCase() == "on") {
        return true;
      } else if (arg.toLowerCase() == "false" ||
        arg.toLowerCase() == "no" ||
        arg.toLowerCase() == "off") {
        return false;
      }
      return "No bool found";
    }

    // Looks for a valid role for rolearrays
    if (type == "roleArray") {
      if (clear) return "clear";
      arg = arg.split(",");
      let pArgs = [];
      arg.forEach(i => {
        let role = guild.roles.find(r => r.name.toLowerCase().startsWith(i.toLowerCase()) || r.id == i || i == `<@&${r.id}>`);
        if (!role) return;
        pArgs.push(role.id);
      });
      // Returns if no roles
      if (!pArgs.length) return "No roles";
      return pArgs;
    }

    if (type == "emoji") {
      let emoji = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/.exec(arg);
      if (!emoji) return "No emoji";
      return emoji[0];
    }
  },
};
