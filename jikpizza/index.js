let Dominos = require("./lib/Dominos");
let Pepperoni = require("./lib/Pepperoni");
let d = require('./utils/askYesNo');
let request = require("request");
var Matcher = require('did-you-mean');
let sites = require("./configs/sites");
let countries = require("./configs/countries");
let tlds = require("./configs/tlds");
let { token } = require("./configs/cfg");
let bot = new Pepperoni(token);
var m = new Matcher(countries.join(" "));

// Sets the didYouMean threshold
m.setThreshold(1.5);
m.ignoreCase();

// Connects the bot & sets its status.
bot.on("ready", () => {
  console.log("Ready!");
  bot.editStatus("online", { name: "eating som pizzas", url: "https://twitch.tv/jiktim", type: 1 });
});

let results = {
  postcode: undefined,
  country: undefined
};

let countryResult = "";
let postcodeResult = "";
let storeResult = "";
let dominosUrl = "biz.dominos.com";

// Country asker function
async function askForCountry(msg, timeout) {
  try {
    let [resp] = await bot.waitForEvent("messageCreate", timeout, m => {
      if (m.author.id != msg.author.id) return "Unknown";
      if (m.channel.id != msg.channel.id) return "Unknown";
      console.log("broyoujust");
      console.log(countryResult);
      countryResult = m.content.toLowerCase();
      return true;
    });
  } catch (err) {
    return "error";
  }
}

// Postal code asker function
async function askForPostcode(msg, timeout) {
  try {
    let [resp] = await bot.waitForEvent("messageCreate", timeout, m => {
      if (m.author.id != msg.author.id) return "Unknown";
      if (m.channel.id != msg.channel.id) return "Unknown";
      console.log("broyoujust");
      console.log(postcodeResult);
      postcodeResult = m.content.toLowerCase();
      return true;
    });
  } catch (err) {
    return "error";
  }
}

// Store asker function
async function askForStore(msg, timeout) {
  try {
    let [resp] = await bot.waitForEvent("messageCreate", timeout, m => {
      if (m.author.id != msg.author.id) return "Unknown";
      if (m.channel.id != msg.channel.id) return "Unknown";
      console.log("broyoujust");
      console.log(storeResult);
      storeResult = m.content.toLowerCase();
      return true;
    });
  } catch (err) {
    return "error";
  }
}

/* async function getMenu(msg, timeout) {
  try {
    let [resp] = await bot.waitForEvent("messageCreate", timeout, m => {
      if (m.author.id != msg.author.id) return "Unknown";
      if (m.channel.id != msg.channel.id) return "Unknown";
      console.log("broyoujust");
      console.log(menuResult);
      menuResult = m.content.toLowerCase();
      return true;
    });
  } catch (err) {
    return "error";
  }
} */

// Restarts the bot (broken ono)
let Dominosthing = new Dominos();
bot.on("messageCreate", async (msg) => {
  if (msg.content.startsWith(".pizza restart")) {
    bot.disconnect();
    delete require.cache[require.resolve("./lib/Dominos.js")];
    delete require.cache[require.resolve("./lib/Pepperoni.js")];
    Pepperoni = require("./lib/Pepperoni");
    Dominos = require("./lib/Pepperoni");
    Dominosthing = new Dominos();
    let bot = new Pepperoni(token);
    bot.connect();
  }

  if (msg.content.startsWith("cancel")) {
    msg.channel.createMessage("fuck you! why u no order!");
    return;
  }

  // Finds a Dominos.
  if (msg.content.startsWith(".pizza find")) {
    console.log(Dominosthing.locateStores("MOROCCO", "MA"));
  }

  // Asks the user what country they're in.
  if (msg.content.startsWith(".pizza order")) {
    bot.createMessage(msg.channel.id, {
      embed: {
        // title: "Step 1",
        description: "**What country are you in?**",
        author: {
          name: "PizzaBot - Step 1",
          icon_url: "https://i.imgur.com/DoAELv7.jpg"
        },
        color: 0x008000,
        footer: {
          text: "(c) cth103, resolved & collaborators"
        }
      }
    });

    await askForCountry(msg, 16000);
    let country = m.get(countryResult.replace(" ", ""));

    // Handler for if an invalid country was given.
    if (!country) {
      bot.createMessage(msg.channel.id, {
        embed: {
          // title: "Error",
          description: "**Couldn't parse your country, please try again.**",
          author: {
            name: "PizzaBot - Error",
            icon_url: "https://i.imgur.com/DoAELv7.jpg"
          },
          color: 0x800000,
          footer: {
            text: "(c) cth103, resolved & collaborators"
          }
        }
      });
      return;
    }
    let tld = tlds.find(t => t.country == country).tld;

    // US
    if (country != "UnitedStates" || country != "USA") {
      dominosUrl = sites.find(t => t.includes(tld));
    }

    // Asks for the user's city if a Dominos is found.
    if (dominosUrl) {
      bot.createMessage(msg.channel.id, {
        embed: {
          // title: "Step 2",
          description: `There appears to be a Dominos in **${country}** **(${dominosUrl})**, what city do you live in?`,
          author: {
            name: "PizzaBot - Step 2",
            icon_url: "https://i.imgur.com/DoAELv7.jpg"
          },
          color: 0x008000,
          footer: {
            text: "(c) cth103, resolved & collaborators"
          }
        }
      });
      // Looks for a Dominos in the city/postal code the user provided.
      await askForPostcode(msg, 20500);
      let epicoolreditgol = await bot.createMessage(msg.channel.id, {
        embed: {
          // title: "Step 2.5",
          description: `Looking for a Dominos in **${postcodeResult}**, **${country}**...`,
          author: {
            name: "PizzaBot - Step 2.5",
            icon_url: "https://i.imgur.com/DoAELv7.jpg"
          },
          color: 0x008000,
          footer: {
            text: "(c) cth103, resolved & collabora tors"
          }
        }
      });

      // Lets the user choose their store.
      let store = await Dominosthing.locateStoreByCity(postcodeResult, country, tld);
      if (store[0]) {
        epicoolreditgol.edit({
          embed: {
            // title: "Step 3",
            description: `**Choose your store *(by ID)* ** \n ${store.map(s => `ID: **${s.StoreID}** Store Name: **${s.StoreName}**`).join("\n ")}`,
            author: {
              name: "PizzaBot - Step 3",
              icon_url: "https://i.imgur.com/DoAELv7.jpg"
            },
            color: 0x008000,
            footer: {
              text: "(c) cth103, resolved & collaborators"
            }
          }
        });
        await askForStore(msg, 305050);
        console.log(store);
        let jonarbuckl = store.map(s => `${s.StoreID}`).join("\n ");
        // 2 basic requirements
        // be a number
        // be 5 digits
        // 1 kinda cringe requirement
        if (!isNaN(Number(storeResult)) && storeResult.length == 5 && jonarbuckl.includes(storeResult)) {
          let jim;
          store.forEach(fg => {
            console.log(fg.StoreID);
            if (fg.StoreID == storeResult) {
              jim = fg; // shoutout to my nigga jim davis who invented funny cat :)
            }
          });
          bot.createMessage(msg.channel.id, jim.StoreName);
          Dominosthing.getMenu(jim.StoreID, country).then(async sex => {
            // VADIM SUKA BLYAT
            var redit = JSON.parse(sex);
            Object.keys(redit.Products).forEach(item => {
              console.log(`new in our bdsm toy epic, the ${redit.Products[item].Name} | ${redit.Products[item].Description}`);
            });
            var haste = require("./lib/Hastebin.js");
            var hoste = new haste();
            await hoste.uploadText("sex kinda cool");
          });
        } else {
          // AHAHAHA
          bot.createMessage(msg.channel.id, "Do you think you're fucking funny? Feeding me fake information like that. Go through the process again to learn your lesson. Absolutely Pathetic.");
        }
      } else {
        epicoolreditgol.edit({
          embed: {
            // title: "Error",
            description: "**No Dominos is located in your city.**",
            author: {
              name: "PizzaBot - Error",
              icon_url: "https://i.imgur.com/DoAELv7.jpg"
            },
            color: 0x800000,
            footer: {
              text: "(c) cth103, resolved & collaborators"
            }
          }
        });
      }

      // Handler for if the user's area doesn't have a Dominos / other errors
    } else {
      epicoolreditgol.edit({
        embed: {
          // title: "Error",
          description: "**No Dominos was found.**",
          author: {
            name: "PizzaBot - Error",
            icon_url: "https://i.imgur.com/DoAELv7.jpg"
          },
          color: 0x800000,
          footer: {
            text: "(c) cth103, resolved & collaborators"
          }
        }
      });
    }
  }
});

bot.connect();
