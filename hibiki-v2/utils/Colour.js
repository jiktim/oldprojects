/*
  Hibiki Colour Utility

  This utility converts normal hex colours into
  decimal codes that Node.js can natively read.
*/

const { colours } = require("../config");

module.exports = type => {
  // Sets the colour constant
  let color;
  // Converts hex codes to decimal codes and looks to see if it's a valid colour
  if (type !== undefined) {
    if (colours[type] != undefined) color = parseInt(colours[type].replace(/#/g, "0x"));
    // Error handler for if an invalid colour was provided
    else throw Error("Invalid colour - check the embed construct.");
    // Replaces hex codes to decimal codes and returns the colour
  } else {
    // Replaces the colour
    color = parseInt(colours.embed.general.replace(/#/g, "0x"));
  }
  return color;
};
