module.exports = {
    name: 'ping',
    disabled: true,
    description: 'Ping!',
    cooldown: 5,
    execute(message) {
        message.channel.send('Pong.');
    },
};