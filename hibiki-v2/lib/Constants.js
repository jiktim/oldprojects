const error = require("../utils/Colour")("error");

Constants = {
  // Static error embeds
  errors: {
    disabledCommand: {
      title: "❌ Error",
      description: "That command is disabled in this server.",
      color: error,
    },
    errorNF: {
      title: "❌ Error",
      description: "Either nothing was found, or we're experiencing difficulties.",
      color: error,
    },
    noArguments: {
      title: "❌ Error",
      description: "No options were provided.",
      color: error,
    },
    nsfwOnly: {
      title: "❌ Error",
      description: "That command can only be run in a NSFW channel.",
      color: error,
    },
    roleNotFound: {
      title: "❌ Error",
      description: "Role not found.",
      color: error,
    },
    userNoPermission: {
      title: "❌ Error",
      description: "You don't have permission to run this command.",
      color: error,
    },
    userNotFound: {
      title: "❌ Error",
      description: "User not found.",
      color: error,
    },
  }
};

module.exports = Constants;
