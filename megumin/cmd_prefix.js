const fs = require('fs');
module.exports = function(msg, bot, args) {
    if (args) {
        if (args.length > 4) {
            bot.createMessage(msg.channel.id, ":x: ``The prefix cant be bigger than 4 characters!``")
        } else {
            if (msg.member.permission.has("manageGuild") == true) { // check perms
                // if everything is true execute this:
                global.prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"))
                global.prefixes[msg.channel.guild.id] = {
                    prefixes: args
                };
                fs.writeFile("./prefixes.json", JSON.stringify(global.prefixes), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                const lembed = {
                    "embed": {
                        "title": "Prefix set!",
                        "description": "Custom prefix set to " + args,
                        "color": 16193101,
                        "timestamp": new Date(),
                        "footer": {
                            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                            "text": "~prefix"
                        }
                    }
                };
                msg.channel.createMessage(lembed)
            } else {
                bot.createMessage(msg.channel.id, ":x: ``You dont have the permissions to this! (You need manage guild)``");
            }
        }
    } else {
        bot.createMessage(msg.channel.id, ":x: ``You need to specify a prefix!``")
    }
}