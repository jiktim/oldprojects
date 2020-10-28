// good solution amirite v2

module.exports = function(msg, bot, args) {
  if (args) {
    if (msg.member.permission.has("banMembers") == true) { // check if mod has perm to ban
      if(msg.mentions[0].id == msg.member.id){ // dont let them commit ban
      bot.createMessage(msg.channel.id, ":x: ``You cant ban **yourself**, lol! :smiley:``")
      } else {
        console.log(msg.mentions[0])
        var person2kick = msg.guild.members.find(fn => fn.id == msg.mentions[0].id);
        if (person2kick.permission.has("kickMembers" || "banMembers")) { // potentially reduce abuse
        bot.createMessage(msg.channel.id, ":x: ``You cant ban a fellow moderator! (yet)``")
        } else {
          if(args.slice(msg.mentions[0].id.length+4).size > 1) { // check if there is a reason
      person2kick.kick("Banned by: "+msg.member.username+" for "+args.slice(msg.mentions[0].id.length+3))
            bot.createMessage(msg.channel.id, "``**"+person2kick.username+"** Has been banned by **"+msg.member.username+"** for: **"+args.slice(msg.mentions[0].id.length+3)+"**``")
        } else {
              person2kick.kick("Banned by: "+msg.member.username+" for: No reason provided")
            bot.createMessage(msg.channel.id, "``**"+person2kick.username+"** Has been banned by **"+msg.member.username+"** for: **No reason provided**``")
 
        }
      }
      }
        } else {
        bot.createMessage(msg.channel.id, ":x: ``You dont have the permissions to do this!`` :angry:");
        }
  } else {
  bot.createMessage(msg.channel.id, ":x: ``You have to mention whoever you want to ban!``")
  }
}