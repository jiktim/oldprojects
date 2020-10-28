var request = require('request')
module.exports = function(msg, bot, args) { // pet someone <3
    if (args) {
        if (msg.mentions[0] != undefined) {
            var user = msg.mentions[0]
            if (user.id == msg.author.id) {
                msg.channel.createMessage("Dont be so lonely! Have a cookie :cookie:")
            } else {
                //msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + msg.mentions[0].username + " a cookie OwO** :cookie:")
                request('https://nekos.life/api/pat', function(error, response, body) {
                    let json = JSON.parse(body); // parsing
                    let result = json.url; // defining the pat
                    msg.channel.createMessage({
                        "embed": {
                            "title": "*" + msg.author.username + "* pats *" + user.username + "*!",
                            "color": 14625534,
                            "image": {
                                "url": result
                            }
                        }
                    })
                })
            }
        } else if (msg.channel.guild.members.find(owo => owo.username.toLowerCase() == args.toLowerCase()) != undefined) {
            var user = msg.channel.guild.members.find(owo => owo.username.toLowerCase() == args.toLowerCase())
            if (user.id == msg.author.id) {
                msg.channel.createMessage("Dont be so lonely! Have a cookie :cookie:")
            } else {
                request('https://nekos.life/api/pat', function(error, response, body) {
                    let json = JSON.parse(body); // parsing
                    let result = json.url; // defining the pat
                    msg.channel.createMessage({
                        "embed": {
                            "title": "*" + msg.author.username + "* pats *" + user.username + "*!",
                            "color": 14625534,
                            "image": {
                                "url": result
                            }
                        }
                    })
                })
            }
            //msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + user.username + " a cookie OwO** :cookie:")
        } else if (msg.channel.guild.members.find(owo => owo.id == args) != undefined) {

            var user = msg.channel.guild.members.find(owo => owo.id == args)
            if (user.id == msg.author.id) {
                msg.channel.createMessage("Dont be so lonely! Have a cookie :cookie:")
            } else {
                request('https://nekos.life/api/pat', function(error, response, body) {
                    let json = JSON.parse(body); // parsing
                    let result = json.url; // defining the pat
                    msg.channel.createMessage({
                        "embed": {
                            "title": "*" + msg.author.username + "* pats *" + user.username + "*!",
                            "color": 14625534,
                            "image": {
                                "url": result
                            }
                        }
                    })
                })
            }
            //msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + user.username + " a cookie OwO** :cookie:")
        }
    } else {
        request('https://nekos.life/api/pat', function(error, response, body) {
            let json = JSON.parse(body); // parsing
            let result = json.url; // defining the pat
            msg.channel.createMessage({
                "embed": {
                    "color": 14625534,
                    "image": {
                        "url": result
                    }
                }
            })
        })
    }
};