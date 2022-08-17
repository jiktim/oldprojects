module.exports = function(msg, ErisClient, ErisSettings, args) {
  if (msg.author.id == "211417829906448387") {
          var splittext = msg.content.split(" ");
          console.log(splittext);
          if (splittext[0] == "b.eval") {
            var sliced = msg.content.slice(6);
            console.log(sliced);
            try {
              var evaluated = eval(sliced);
              console.log(evaluated);
              msg.channel.createMessage("Input:\n```js\n" + sliced + "```\nOutput:\n```js\n" + evaluated + "\n```");
            }catch(err){
              console.log("An error occurred while using eval:" + err.message);
              msg.channel.createMessage("Error:\n```xl\n" + err.message + "\n```");
        }}}}
