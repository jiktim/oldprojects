const Command = require("../../lib/Command");
const askFor = require("../../utils/Ask").For;
const waitFor = require("../../utils/Timeout");

class setupCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["automod", "cfg", "config", "configure"],
      description: "Configures the bot for use in the server.",
      usage: "<show>",
      clientperms: ["embedLinks", "manageMessages", "addReactions"],
      requiredperms: "manageGuild",
      cooldown: 3000,
      allowdisable: false,
      staff: true,
    });
  }

  async run(msg, args) {
    // Sets back & categories
    const back = "⬅️";
    const submit = "☑";
    let categories = [{ name: "Automod", emoji: "🛠", items: ["AntiInvite", "invitePunishments", "AntiSpam", "spamThreshold", "spamPunishments", "msgOnPunishment"] },
      { name: "Features", emoji: "✨", items: ["agreeChannel", "agreeRole", "easyTranslate", "starAmount", "starChannel", "starEmoji", "starSelfStarring"] },
      { name: "Logging", emoji: "📜", items: ["leavejoin", "joinMessage", "leaveMessage", "guildLogging", "modLogging"] },
      { name: "Roles", emoji: "👤", items: ["autorole", "muted", "staffrole", "verified"] }
    ];

    // Gets the valid settings
    const settings = require("../../utils/modules/ValidItems");
    // Gets the config
    let cfg = await this.db.table("guildconfig").get(msg.guild.id);
    // Inserts a blank guildconfig if needed
    if (!cfg) {
      await this.db.table("guildconfig").insert({
        id: msg.guild.id
      });
      cfg = { id: msg.guild.id };
    }

    // Inserts blank info if needed
    if (!cfg.invitePunishments) cfg.invitePunishments = [];
    if (!cfg.spamPunishments) cfg.spamPunishments = [];
    categories.forEach((c, i) => {
      c.items = c.items.sort((a, b) => a > b ? 1 : -1);
      categories[i] = c;
    });

    // Sends the setup config if args = show
    if (args.length && args.join(" ").toLowerCase() == "show") {
      msg.channel.createMessage({
        embed: {
          title: "✨ Setup",
          description: "The server's config is listed below.",
          // Sets the settings to send
          fields: settings.filter(f => f.id != "prefix").sort((a, b) => a.id > b.id ? 1 : -1).map(s => {
            let sid = cfg[s.id];
            // ChannelID, roleID, roleArray, punishments
            if (s.type == "channelID" && cfg[s.id]) sid = `<#${cfg[s.id]}>`;
            else if (s.type == "roleID" && cfg[s.id]) sid = `<@&${cfg[s.id]}>`;
            else if (s.type == "roleArray" && cfg[s.id]) sid = cfg[s.id].map(r => `<@&${r}>`).join(", ");
            else if (s.type == "punishment") sid = cfg[s.id].join(", ");
            else if (s.type == "array" && cfg[s.id]) sid = cfg[s.id].map(c => `${c}`).join(", ");
            // Sets it as unconfigured if it's not setup
            return {
              name: s.label || s.id,
              value: sid || "Not configured",
              inline: true,
            };
          }),
          color: require("../../utils/Colour")("general"),
        },
      });
      return;
    }

    // Sends the original message
    let omsg = await msg.channel.createMessage({
      embed: {
        title: "✨ Setup",
        description: `Alternatively, you can use the [web dashboard](${this.bot.config.homepage}/login/) to configure your server.`,
        fields: categories.map(cat => {
          return {
            name: `${cat.emoji.length > 2 ? "<:" : ""}${cat.emoji}${cat.emoji.length > 2 ? ">" : ""} ${cat.name}`,
            value: `${cat.items.map(i => `\`${i}\``).join(", ")}`
          };
        }),
        color: require("../../utils/Colour")("general"),
      },
    });

    // Function to get category
    async function getCategory(m, boat, editMsg) {
      if (editMsg) m.edit({
        embed: {
          title: "✨ Setup",
          fields: categories.map(cat => {
            return {
              name: `${cat.emoji} ${cat.name}`,
              value: `${cat.items.map(i => `\`${i}\``).join(", ")}`
            };
          }),
          color: require("../../utils/Colour")("general"),
        },
      });

      // Removes all reactions from the message if there are any
      if (Object.getOwnPropertyNames(m.reactions).length > 0) await m.removeReactions();
      categories.map(cat => cat.emoji).forEach(catEmoji => m.addReaction(catEmoji));
      // Waits for reaction add
      let category;
      let stop = false;
      await waitFor("messageReactionAdd", 60000, async (message, emoji, uid) => {
        if (message.id != m.id) return;
        if (uid != msg.author.id) return;
        if (!emoji.name) return;
        // Returns if stopped
        if (stop) return;
        // Looks for the category
        category = categories.find(cat => cat.emoji.length > 2 ? cat.emoji.split(":")[1] == emoji.id : cat.emoji == emoji.name);
        // Returns if it isn't right category
        if (!category) return;
        await m.removeReactions();
        return true;
      }, boat).catch(e => {
        if (e == "timeout") {
          category = { error: "timeout" };
          stop = true;
        }
      });
      return category;
    }

    // Returns the category items embed
    function itemsEmbed(category) {
      return {
        embed: {
          title: "✨ Setup",
          fields: category.items.map(cat => {
            let setting = settings.find(s => s.id == cat);
            return {
              name: setting.label,
              value: setting.description
            };
          }),
          color: require("../../utils/Colour")("general"),
        },
      };
    }

    let category = await getCategory(omsg, this.bot, false);
    // Returns on timeout
    if (category.error == "timeout") return omsg.edit(this.bot.embed("❌ Error", "Timeout reached, exiting setup.", "error"));
    omsg.edit(itemsEmbed(category));
    await omsg.removeReactions();
    // Gets the emoji
    await category.items.map(async cat => omsg.addReaction(settings.find(s => s.id == cat).emoji));
    // Adds the back reaction
    omsg.addReaction(back);
    await waitFor("messageReactionAdd", 120000, async (message, emoji, uid) => {
      if (uid != msg.author.id) return;
      if (message.id != omsg.id) return;
      if (!emoji.name) return;
      if (emoji.name == back) { category = { repeat: true }; return true; }
      // Looks for the setting
      let setting = settings.find(s => s.id == category.items.find(cat => settings.find(s => s.id == cat).emoji == emoji.name));
      // Return if the emoji wasnt a valid setting
      if (!setting) return;
      message.removeReaction(emoji.name, uid);
      let cooldown = 0;
      // Setting types
      if (setting.type == "bool") {
        if (cfg[setting.id]) cfg[setting.id] = !cfg[setting.id];
        else cfg[setting.id] = true;
        await this.bot.db.table("guildconfig").get(msg.guild.id).update(cfg);
        // Edits the original message
        omsg.edit(this.bot.embed(setting.label, `${setting.id} has been **${cfg[setting.id] ? "enabled" : "disabled"}**.`, "general"));
        setTimeout(() => omsg.edit(itemsEmbed(category)), 1500);
      } else if (setting.type == "punishment") {
        const punishments = { Mute: "🔇", Purge: "💣", Strike: "⚒" };
        // Custom punishment descriptions
        const punishmentDescription = { Mute: null, Purge: null, Strike: null };
        // Sets the valid punishments
        const validpunishments = Object.getOwnPropertyNames(punishments);

        await omsg.removeReactions();
        omsg.edit(this.bot.embed(`🔨 Punishments for ${setting.pickerLabel}`, validpunishments.map(p => `${punishments[p]} ${p}${punishmentDescription[p] ? punishmentDescription[p] : ""}: **${cfg[setting.id].includes(p) ? "enabled" : "disabled"}**`, "general").join("\n")));
        validpunishments.forEach(p => omsg.addReaction(punishments[p]).catch(() => {}));
        // Adds the submit reaction
        omsg.addReaction(submit);
        await waitFor("messageReactionAdd", 60000, async (m, emojii, user) => {
          if (m.id != omsg.id) return;
          if (user != msg.author.id) return;
          if (!emojii.name) return;

          if (emojii.name == submit) {
            await omsg.removeReactions();
            await this.bot.db.table("guildconfig").get(msg.guild.id).update(cfg);
            omsg.edit(itemsEmbed(category));
            category.items.map(cat => omsg.addReaction(settings.find(s => s.id == cat).emoji));
            omsg.addReaction(back);
            return true;
          }
          // Removes the reaction
          omsg.removeReaction(emojii.name, user);
          let punishment = validpunishments.find(p => punishments[p] == emojii.name);
          if (cfg[setting.id].includes(punishment)) cfg[setting.id].splice(cfg[setting.id].indexOf(punishment), 1);
          else cfg[setting.id].push(punishment);
          // Edits the message
          omsg.edit(this.bot.embed(`🔨 Punishments for ${setting.pickerLabel}`, validpunishments.map(p => `${punishments[p]} ${p}${punishmentDescription[p] ? punishmentDescription[p] : ""}: **${cfg[setting.id].includes(p) ? "enabled" : "disabled"}**`, "general").join("\n")));
        }, this.bot).catch(async e => {
          if (e == "timeout") {
            await omsg.removeReactions();
            category.items.map(cat => omsg.addReaction(settings.find(s => s.id == cat).emoji));
            omsg.addReaction(back);
            omsg.edit(itemsEmbed(category));
          }
        });
      } else {
        // Asks the user to respond
        omsg.edit(this.bot.embed("✨ Setup", `Respond with your desired **${setting.typelabel || setting.type}**.`, "general"));
        await waitFor("messageCreate", 90000, async (m) => {
          // Returns if bad info is given
          if (m.author.id != msg.author.id) return;
          if (m.channel.id != msg.channel.id) return;
          if (!msg.content) return;
          // Sets the result
          let result = askFor(setting.type, m.content, msg.guild);
          // Returns if the user set an invalid option
          if (setting.type != "bool" && !result || typeof result == "string" && result.startsWith("No")) {
            // Sends an error message and quickly deletes it
            let errormsg = await msg.channel.createMessage(this.bot.embed("❌ Error", `Invalid ${setting.typelabel}${Math.abs(cooldown - 2) == 0 ? "" : `; **${Math.abs(cooldown - 2)}** attempts left before exiting.`}`, "error"));
            cooldown++;
            setTimeout(() => {
              errormsg.delete();
            }, 1000);

            // If the cooldown has been reached, edit the original message
            if (cooldown > 2) {
              omsg.edit(itemsEmbed(category));
              return true;
            }
            return;
          }

          // Checks if a roleArray is over or under the limit
          if (setting.type == "roleArray" && setting.maximum && result.length > setting.maximum)
            return msg.channel.createMessage(this.bot.embed("❌ Error", `You can't set more than ${setting.maximum} roles.`, "error"));
          // Checks if a number is over or under the limit
          if (setting.type == "number" && setting.maximum && setting.maximum && (setting.minimum > result || setting.maximum < result))
            return msg.channel.createMessage(this.bot.embed("❌ Error", `The number needs to be under ${setting.maximum} and under ${setting.minimum}.`, "error"));

          // Clear handler
          if (result == "clear") result = null;
          cfg[setting.id] = result;
          // Sends the agreechannel embed
          if (setting.id == "agreeChannel")
            this.bot.createMessage(result, this.bot.embed("👋 Welcome", `To access the rest of the server, type \`${cfg.prefix.length ? guildconfig.prefix : this.bot.config.prefix}agree\`.`)).catch(() => {});

          // Updates the guild config
          await this.db.table("guildconfig").get(msg.guild.id).update(cfg);

          m.delete();
          let setmsg = await msg.channel.createMessage(this.bot.embed("✨ Setup", `**${setting.id}** has been set to **${result}**.`, "success"));
          // Deletes the message after 2 seconds
          setTimeout(() => {
            setmsg.delete().catch(() => {});
          }, 2000);
          omsg.edit(itemsEmbed(category));
          return true;
        }, this.bot);
      }
    }, this.bot);

    // Deletes & reruns the command if user reacts with the back emoji
    if (category.repeat) {
      omsg.delete();
      return this.run(msg, args);
    }
  }
}

module.exports = setupCommand;
