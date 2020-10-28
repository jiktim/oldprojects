module.exports = function(msg, bot, args) { // duck
  var pls_fs = require('fs');
    if (msg.mentions[0] != undefined) {
        msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + msg.mentions[0].username + " a cookie OwO** :cookie:")
    } else if (msg.channel.guild.members.find(owo => owo.username.toLowerCase() == args.toLowerCase()) != undefined) {
        var user = msg.channel.guild.members.find(owo => owo.username.toLowerCase() == args.toLowerCase())
        msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + user.username + " a cookie OwO** :cookie:")
    } else if (msg.channel.guild.members.find(owo => owo.id == args) != undefined) {
        var user = msg.channel.guild.members.find(owo => owo.id == args)
        msg.channel.createMessage(":cookie: **" + msg.author.username + " gave " + user.username + " a cookie OwO** :cookie:")
    }
}; // lets ignore this FOR NOW we are gonna have to rewrite
