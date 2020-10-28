var fs = require('fs')

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24; // 
    h += d * 24; //shut up stackoverflow is not skid
    return h + ' hours ' + m + ' minutes and ' + s + ' seconds';
}

module.exports = function(msg, bot, args) {
    var daily = 1337;
    var randomNumber = 0;
    global.coins = JSON.parse(fs.readFileSync("./coins.json", "utf8"))
    if (!global.coins[msg.author.id]) {
        daily = Math.floor(Math.random() * 123) + 55
        global.coins[msg.author.id] = {
            cookies: 0,
            lastdaily: 9999,
            lasthourly: 9999
        }
        console.log("db thing owo")
        fs.writeFile("./coins.json", JSON.stringify(global.coins), (err) => {
            if (err) {
                console.log(err)
            }
        })
    } else {
        randomNumber = Math.floor(Math.random() * 123) + 55
        daily = global.coins[msg.author.id].cookies + randomNumber
    }

    if (new Date() - new Date(global.coins[msg.author.id].lastdaily) > 86400000) {
        global.coins[msg.author.id] = {
            cookies: daily,
            lastdaily: new Date(),
            lasthourly: global.coins[msg.author.id].lasthourly
        }
        fs.writeFile("./coins.json", JSON.stringify(global.coins), (err) => {
            if (err) {
                console.log(err)
            }
        })
        var totalcookies = daily - global.coins[msg.author.id].cookies
        const dailyembed = {
            "embed": {
                "title": "You earned " + randomNumber + " cookies! :cookie:",
                "description": "Yay! :cookie:",
                "color": 10211145,
                "timestamp": new Date(),
                "footer": {
                    "text": "~daily"
                }
            }
        };
        msg.channel.createMessage(dailyembed)
    } else {
        var datething = new Date(global.coins[msg.author.id].lastdaily);
        var seconddatething = new Date();
        var fuckjimbo = 86400000 - (seconddatething.getTime() - datething.getTime());
        msg.channel.createMessage("Wait! Your turn is in " + convertMS(fuckjimbo)) //SHOULD BE HOURS
    }
}
