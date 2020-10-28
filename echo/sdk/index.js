/*
  Echo Node.js SDK
  © 2020 smolespi & resolved

  github.com/smolespi/Echo
*/

const fetch = require("node-fetch");

// SDK settings
module.exports.settings = {
  host: "http://localhost:6969",
  auth: "",
  id: "",
};

// Error object func
function errobj(err, origin) {
  return {
    message: typeof err === "string" ? err : err.message,
    stack: err.stack,
    origin: origin,
  };
}

module.exports.capture = async (err, origin) => {
  if (!err) return;
  // Fetches the captureEvent API
  const res = await fetch(`${module.exports.settings.host}/api/captureEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": module.exports.settings.auth },
    // Sets body as error object
    body: JSON.stringify({
      error: errobj(err, origin),
      id: module.exports.settings.id,
    }),
  }).catch((d) => { console.log(d); });
  return res;
};

// Alternative to setting module.settings (for const)
module.exports.setSettings = (settings) => {
  module.exports.settings = settings;
};

module.exports.init = () => {
  // Captures uncaughtExceptions
  global.process.on("uncaughtException", (err, origin) => {
    console.log(err);
    module.exports.capture(err.message, origin);
  });

  // Captures unhandledRejections
  global.process.on("unhandledRejection", (err) => {
    console.log(err);
    module.exports.capture(err, err.toString().split(":")[0] || "unhandledRejection");
  });
};
