/*
  Hibiki Embed Utility

  This command creates embeds by being
  called thru this.bot.embed or this.embed.
*/

const { colours } = require("../config");

module.exports = (title, description, type) => {
  // Sets the basic configuration of the embed
  let color = "";
  let construct = {
    embed: {
      footer: {},
    },
  };

  // If it is an invalid colour, throw an error. This should not normally happen
  if (type !== undefined) {
    if (colours[type] != undefined) color = parseInt(colours[type].replace(/#/g, "0x"));
    else throw Error("Invalid colour!");
  } else {
    // Converts proper hex colours to decimals
    color = parseInt(colours.general.replace(/#/g, "0x"));
  }

  // Sets the description for the embed. If no description is given, don't use one
  if (!description || description != undefined) {
    construct.embed.description = description;
  }

  // Sets the title for the embed. If no title is given, don't use one
  if (!title || title != undefined) {
    construct.embed.title = title;
  }

  // Sets the embed colour
  construct.embed.color = color;
  construct.embed.addField = (name, text, icon) => addField(name, text, icon);

  // Returns back to the constructor
  return construct;
};
