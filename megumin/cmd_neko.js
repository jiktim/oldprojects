var request = require('request');
module.exports = function(param, args) {
    request('https://nekos.life/api/neko', function(error, response, body) {
        let json = JSON.parse(body); // parsing
        let result = json.neko; // omg cute neko omg :o
        const data = { // define embed thing
            "embed": {
                "title": "Here is a cute neko picture:",
                "color": 13631743,
                "image": {
                    "url": result
                }
            }
        }
        param.channel.createMessage(data); // send embed
    });
}