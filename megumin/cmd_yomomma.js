var request = require('request');
module.exports = function(param, clientArg, args) { // it sends the!
    request('https://api.yomomma.info/', function(error, response, body) {
    let json = JSON.parse(body); // parsing
    let result = json.joke; // defining the!
    param.channel.createMessage("``"+result+"``");
    });
};