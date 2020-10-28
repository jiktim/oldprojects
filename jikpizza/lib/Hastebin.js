const get = require('snekfetch');

class Hastebin {
  constructor() {
    var haste = "hst0";
    // haste haste haste  :) haste iii
  }
  // 69 sex number XD
  async uploadText(txt) {
    var hasteomg = get.post("https://hastebin.com/documents", { data: txt }).then(sex => {
      console.log(sex.body.key);
    });
    console.log(hasteomg.key);
  }
}

module.exports = Hastebin;
// const hastebin = await get.post("https://hastebin.com/documents", { data: strikeString });
// 	Hastebin URL](https://hastebin.com/${hastebin.body.key})`,
// pro 😎👍💻 .........
// jiktim style
// jus got redit gol..;;;; feel epicccc
