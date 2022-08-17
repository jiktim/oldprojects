module.exports = function(msg, ErisClient) {
ErisClient.createMessage(msg.channel.id, "Let me ping my network....").then(m =>{
    m.edit(`Pong. Took me ${m.timestamp - msg.timestamp}ms to ping.`)

})
}
