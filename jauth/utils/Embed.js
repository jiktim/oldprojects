const { colors } = require("../config");

module.exports = (title, description, type) => {
  // Sets the basic configuration of the embed
  let color = "";
  let construct = {
    embed: {
      footer: {},
    },
  };

  // Errors if an invalid/undefined colour is given
  if (type !== undefined) {
    if (colors[type] != undefined) color = parseInt(colors[type].replace(/#/g, "0x"));
    else throw Error("Invalid colour!");
  } else {
    // Converts proper hexes to JS's hexes
    color = parseInt(colors.general.replace(/#/g, "0x"));
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

  // Returns back to the constructor
  return construct;
};
