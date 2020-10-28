const { Client } = require("Eris");

class Pepperoni extends Client {
  constructor(token, options) {
    super(token, options);
  }

  waitForEvent(event, timeout, check) {
    let t;
    if (!check || typeof check !== "function") check = () => true;
    return new Promise((rs, rj) => {
      const listener = (...args) => {
        if (check && typeof check == "function" && check(...args) === true) {
          dispose();
          rs([...args]);
          return;
        }
      };
      const dispose = () => {
        this.removeListener(event, listener);
      };

      if (timeout) t = setTimeout(() => {
        dispose();
        rj("timeout");
      }, timeout);
      this.on(event, listener);
    });
  }
}

module.exports = Pepperoni;
