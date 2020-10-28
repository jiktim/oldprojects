module.exports = function(param, clientArg, args) {
var responses = ["It is certain", "Without a doubt", "You may rely on it", "Most likely", "Yes", "Signs point to yes", "Better not tell you now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
param.channel.createMessage(":8ball: | `"+responsess[Math.floor(Math.random() * (responsess.length))]+"`");
}
