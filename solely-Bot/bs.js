module.exports.runBot = function(token) {
const Eris = require("eris");
const ErisSettings = require("./ErisSettings.json"),
token = ErisSettings.token,
prefix = ErisSettings.prefix,
oid = ErisSettings.oid,
playing = ErisSettings.playing,
osuApi = ErisSettings.osuApi
var ErisClient = new Eris(token);
ErisClient.editStatus(
  {name: ErisSettings.playing}
)
ErisClient.on("ready", () => {
    console.log("Ready.");
});

ErisClient.on("messageCreate", (msg) => {
    var message = msg;
  if (msg.content.startsWith(prefix)){
		var prefslice = msg.content.slice(prefix.length);
		var commandName = prefslice.split(" ")[0];
		if (prefslice != "") {
			try {
			require(`./Commands/${commandName}.js`)(msg, ErisClient);
		} catch(err) {
			console.log(err.stack);
		}

		}
	}
  });
  ErisClient.connect();
}
