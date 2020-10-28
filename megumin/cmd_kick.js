// good solution amirite

module.exports = function(msg, bot, args) {
  if (args) {
    if (msg.member.permission.has("kickMembers") == true) { // check perms
      if(msg.mentions[0].id == msg.member.id){ // dont let commit kick
      bot.createMessage(msg.channel.id, ":x: ``You cant kick **yourself**, lol! :smiley:``")
      } else {
        console.log(msg.mentions[0])
        var person2kick = msg.guild.members.find(fn => fn.id == msg.mentions[0].id);
        if (person2kick.permission.has("kickMembers" || "banMembers")) { //A BUSE 
        bot.createMessage(msg.channel.id, ":x: ``You cant kick a fellow moderator! (yet)``")
        } else {
          console.log(args.slice(msg.mentions[0].id.length+3))
          if(args.slice(msg.mentions[0].id.length+4).size > 2) {
            
      person2kick.kick("Kicked by: "+msg.member.username+" for "+args.slice(msg.mentions[0].id.length+3))
            bot.createMessage(msg.channel.id, "``**"+person2kick.username+"** Has been kicked by **"+msg.member.username+"** for: **"+args.slice(msg.mentions[0].id.length+3)+"**``")
        } else {
              person2kick.kick("Kicked by: "+msg.member.username+" for: reason was not provided")
            bot.createMessage(msg.channel.id, "``**"+person2kick.username+"** Has been kicked by **"+msg.member.username+"** for: **No reason provided!**``")

        }
      }
      }
        } else {
        bot.createMessage(msg.channel.id, ":x: ``You dont have the permissions to this!``");
        }
  } else {
  bot.createMessage(msg.channel.id, ":x: ``You have to mention whoever you want to kick!``")
  }
}