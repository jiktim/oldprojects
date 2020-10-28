module.exports = function(param, clientArg, args) { // it sends ping  
    setTimeout(() =>console.log("ping"), 5000);
    param.channel.createMessage(`:ping_pong: pong! (wait)`).then(m => m.edit(`:ping_pong: pong! took ${m.timestamp - param.timestamp} ms.`))// it sends a message then edits it
}
