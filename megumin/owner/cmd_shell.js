module.exports = function(param, clientArg, args) {
      require('child_process').exec(args, function(error, stdout, stderr) {
          param.channel.createMessage("```prolog\nError: " + stderr + "\n (" + error + ")\nOutput: " + stdout + "\n```")

      });
};