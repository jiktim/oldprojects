var request = require('request');
var booru = require('booru');
const fs = require('fs');
// beta
var argument = new Array();
var common;
module.exports = function(param, clientArg, args) { // it sends help
  if(param.channel.nsfw) {
    if (args.toLowerCase().includes("loli") | args.toLowerCase().includes("child") | args.toLowerCase().includes("girl") |  args.toLowerCase().includes("young") | args.toLowerCase().includes("kid") | args.toLowerCase().includes("boy") | args.toLowerCase().includes("underag") | args.toLowerCase().includes("minor")) {
     param.channel.createMessage("As Megumin is hosted in France, lolicons are illegal under Article 227-23 since 1994 (24 years :O), So I do not have the right to give you lolicon. :smiley:"); // log it into a file lol sure
     fs.appendFile('pedolog', param.member.username + "#" + param.member.discriminator + " ("+param.member.id+") \n", function (err) {
         if (err) throw err;
   });
 } else {
     booru.search('r34', [args], {
      limit: 1,
      random: true
    }).then(booru.commonfy)
      .then(images => {
        for (let image of images) {
          param.channel.createMessage("Here is a lewd picture: "+image.common.file_url);
        }
        })
 }} else {
    param.channel.createMessage('This is not an NSFW channel :smiley:');
  }
}