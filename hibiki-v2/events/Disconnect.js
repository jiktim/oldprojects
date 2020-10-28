/*
  Hibiki Disconnect Event

  All this does is log when Hibiki loses connection.
  Eris should handle reconnecting to the dAPI fine.
*/

const Event = require("../lib/Event");
const format = require("../utils/Format");

// Sets the Disconnect event
class disconnect extends Event {
  constructor(...args) {
    super(...args, {
      name: "disconnect",
    });
  }

  async run() {
    // Logs when Eris loses connection
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Lost connection to Discord, Eris is attempting to reconnect...`.red}`);
  }
}

module.exports = disconnect;
