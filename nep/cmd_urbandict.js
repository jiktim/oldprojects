module.exports = function(param, clientArg, args) { // it sends urban dictionary   
var request = require('request');
    request("http://api.urbandictionary.com/v0/define?term=" + encodeURI(args), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var pack = JSON.parse(body); //parsing stuff
            try {
                param.channel.createMessage(':robot: \n **' + args + '** By **' + pack.list[1].author + '** \nDefinition: ```' + pack.list[1].definition + '```\n\n*Likes* :thumbsup: : ' + pack.list[1].thumbs_up + '\n***Dislikes*** :thumbsdown: : ' + pack.list[1].thumbs_down + ""); //send the stuff
            } catch (no) {
                param.channel.createMessage("\n :x: " + "Your word is so fucked up it's not even in the urban dictionary, :smiley:"); //error message
            }
        } else if (response.statusCode == 404 || 400) {
           console.log("hmmm ok");
        } else console.log(error);
    });
}
