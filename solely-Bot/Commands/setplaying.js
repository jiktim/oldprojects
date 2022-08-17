module.exports = function(msg, ErisClient) {
      if (msg.author.id == oid) {
        var args = msg.content.split(" ").slice(1);
      ErisClient.editStatus({name: args.join(' ')})
    }}
