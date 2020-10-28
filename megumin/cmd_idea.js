const fs = require('fs');
module.exports = function(msg, clientArg, args) {
  if (args) {
fs.appendFile('./logs/ideas', "["+msg.author.username+":"+msg.author.id+"] ["+msg.guild.name+":"+msg.guild.id+"]  ("+args+")\n", function (err) {
  if (err) throw err;
  msg.channel.createMessage("``Your idea has been submitted!``");
});
  }
}; 