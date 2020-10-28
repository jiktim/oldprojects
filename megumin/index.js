//coded by firec, tttie, a jew (jeuxjeux20) and cth103 'use strict';
//var mongo = require('mongodb').MongoClient;
//var R6Stats = require('r6stats');
var fs = require("fs")
const uri = process.env.mongouri
const Eris = require("eris");
var token = process.env.token; //dont fricking leak
//  mongo.connect(uri, function(err, db) {
global.prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8")) // get prefixesssss
var bot = new Eris(process.env.token);
var json = JSON.parse(fs.readFileSync('package.json', 'utf8')) //find version of bot
global.version = json.version
var prefix = "~";
const spy = false;

function dbots() {
    var https = require("https");
    var authToken = process.env.dbl;
    var options = {
        hostname: "bots.discord.pw",

        path: "/api/bots/255397678492418048/stats",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    };
    var req = https.request(options, function(res) {
        res.setEncoding("utf8");
        res.on("data", function(body) {});
    });
    req.on("error", function(e) {
        console.log("problem with request: " + e.message);
    });
    // write data to request body
    req.write(`{"server_count" : ${bot.guilds.length}}`);
    req.end();
}
//anyone can set the custom prefix, isnt that right.
var customprefix = "meg!";
var ah = "";
exports.customprefix = customprefix;
//jew shit
var AllGames = ["With Aqua \u2764", "With Darkness \u2764", "With Kazuma \u2764", "With Wiz \u2764", "With Yunyun \u2764", "With Komekko \u2764", "With code!", "With Fire \uD83D\uDD25"];
try {
    var cmds = new Array();
    //load
    let loadAll = function() {
        let fa = fs.readdirSync("./");
        for (let i = 0; i < fa.length; i++) {
            let cmF = fa[i];
            if (cmF.endsWith(".js")) {
                var name = cmF.split(".js")[0];
                if (name != "index") {
                    cmds[name.replace("cmd_", "")] = require("./" + name + ".js")
                    console.log(cmF.split(".js")[0] + ".js")
                }
            }
        }
    }
    var cmdso = new Array();
    let loadOWNRcmds = function() {
        let fa = fs.readdirSync("./owner/");
        for (let i = 0; i < fa.length; i++) {
            let cmFo = fa[i];
            if (cmFo.endsWith(".js")) {
                var name = cmFo.split(".js")[0];
                if (name != "index") {
                    cmdso[name.replace("cmd_", "")] = require("./owner/" + name + ".js")
                    console.log(cmFo.split(".js")[0] + ".js (OWNER COMMAND)")
                }
            }
        }
    }

    function setGame(ok) {
        var game = {
            name: ok
        };
        bot.editStatus("online", game);
    }
    Object.defineProperty(Eris.Message.prototype, "guild", {
        get: function() {
            return this.channel.guild;
        }
    })
    bot.on("ready", () => {
        setGame(AllGames[Math.floor(AllGames.length * Math.random())] + " |  ~help (" + bot.guilds.size + " Guilds)")
        console.log("Megumin, The discord bot Copyright (C) 2018 Jiktim (Jimmy Team)");
        console.log("This program comes with ABSOLUTELY NO WARRANTY");
        console.log("This is free software, and you are welcome to redistribute it under certain conditions.");
        if (spy == true) {
            console.log("Message logging is on! all messages will be logged to ./logs/msglog");
        } else {
            console.log("Message logging is off!");
        }
        console.log("loading...");
        loadAll();
        loadOWNRcmds();
        console.log("I am ready, BEEP BOOP."); // log when the bot is ready
        //483695377950834688

        setInterval(function() {
            setGame(AllGames[Math.floor(AllGames.length * Math.random())] + " |  ~help (" + bot.guilds.size + " Guilds)")
        }, 180000); //set the game
        /*bot.guilds.find(fn => fn.id == "476892731554136074").roles.find(fn => fn.name == "placeholder").edit({
        name: ""
        })*/
        dbots();
    });

    bot.on("guildCreate", svr => {

        //db.guildconfig.insertOne(svr.id)
        dbots()
        setGame(AllGames[Math.floor(AllGames.length * Math.random())] + " |  ~help (" + bot.guilds.size + " Guilds)");
        console.log("New Server : " + svr.name || " vietnam war "); //log when the bot gets added to a new guild
    });

    bot.on("guildDelete", (svr, unavailable) => {
        dbots()
        //db.deleteOne(svr.id) //u need some filter or smth idk
        console.log("I was deleted in  " + svr.name); //log when the bot gets kicked/banned or the guild gets deleted
    });

    bot.on("channelDelete", (ch, svr) => {
        //console.log("Channel " + ch.name + " was deleted in the server" + svr.name);
    });

    bot.on("guildMemberRemove", (svr, member) => {
        //console.log(member.name + " was kicked in " + svr.name);
    });

    bot.on("guildBanAdd", (svr, usr) => {
        //console.log("On the chaos named " + svr.name + " an person named " + usr.name + " was banned.");
    });

    bot.on("guildBanRemove", (svr, usr) => {
        //console.log("Oh well guess what in " + svr.name + " they unbanned " + usr.name );
    });
    bot.on("messageDelete", msg => {
        /* if (msg.content != undefined) {
             console.log("Message deleted by " + msg.member.username || "anon");
             console.log("contents: " + msg.content || "Cannot get the contents, sorry boi");
         }*/
    });
    bot.on("messageCreate", msg => {
      if (msg.channel.type == 1) { return; }
      if (msg.author.bot) { return; }
        function commandrun(asd) {
            var command = msg.content.slice(asd)
            var commandName = command.split(" ")[0].toLowerCase();
            var args = command.slice((commandName.length + 1))
            if (cmds[commandName]) {
                try {
                    cmds[commandName](msg, bot, args, cmds)
                } catch (e) {
                    fs.appendFile('errors', e + "\n", function(err) {
                        if (err) throw err;
                    });
                    console.log(e)
                }
            }

            global.owners = ["478512959598100501", "244509121838186497", "457250790751600652", "284432595905675264", "150628341316059136", "134348241700388864"]
            if (global.owners.indexOf(msg.author.id) != -1) {
                if (cmdso[commandName]) {
                    try {
                        cmdso[commandName](msg, bot, args, cmdso, global.owners)
                    } catch (e) {
                        fs.appendFile('errors', e + "\n", function(err) {
                            if (err) throw err;
                        });
                        console.log(e)
                    }
                }
            } else if (global.owners.indexOf(msg.author.id) == -1) {
                /*                var notownrmsg = msg.channel.createMessage("This command is for owners only!").then(lul => setTimeout(function() {
                                    lul.delete()
                                }, 3000))*/
            }
        }
        if (msg.mentions[0] != undefined) {
            if (msg.mentions[0].id == 255397678492418048) {
              try {
                commandrun(22)
              } catch (e) {
                        fs.appendFile('errors', e + "\n", function(err) {
                            if (err) throw err;
                        });
                        console.log(e)
                    }
            }
        }
        if (msg.content.startsWith(prefix)) {
          try {
            commandrun(prefix.length)
          } catch (e) {
                        fs.appendFile('errors', e + "\n", function(err) {
                            if (err) throw err;
                        });
                        console.log(e)
                    }
        }

try {
      if (global.prefixes[msg.channel.guild.id] != undefined) {
var cprefix = global.prefixes[msg.channel.guild.id].prefixes
}
if(msg.content.startsWith(cprefix)) {
commandrun(cprefix.length)
}
} catch(e) {
  console.log(e)
    }

        if (spy == true) {
            fs.appendFile('./logs/msglog', "[" + msg.author.username + ":" + msg.author.id + "] [" + msg.guild.name + ":" + msg.guild.id + "]  (" + msg.content + ")\n", function(err) {
                if (err) throw err;
            });
        }
    });
} catch (err) {
    console.log("ERROR: " + err);
}
bot.connect();
//  });                  