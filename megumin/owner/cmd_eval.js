module.exports = function(msg, clientArg, args, bot, db) { // it sends ping
            try {
                var evaluated = eval(args);
                console.log(evaluated);
                msg.channel.createMessage(":white_check_mark: Successfully evaluated!\n**Input:**\n**```js\n" + args + "```**\n**Output:**\n**```js\n" + evaluated + "\n```**");
              }catch(err){
                console.log("An error occurred while using eval:" + err.message);
                msg.channel.createMessage(":x:**Error:**:x:\n**```xl\n" + err.message + "\n```**");
              }
  }