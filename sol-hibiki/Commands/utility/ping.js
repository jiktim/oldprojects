const Command = require('../../Structures/Command');
const responses = ['gotta go fast', 'tish is a meme', '( ͡° ͜ʖ ͡°)', 'try to take this [̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]', 'can\'t you see me?'];

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['pong', 'ping-pong'],
            group: 'utility',
            memberName: 'ping',
            description: 'Measures the bot ping.',
            examples: ['ping'],
            guarded: true,
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const message = await msg.say(responses[Math.floor(Math.random() * responses.length)]);
        const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
        return message.edit(`Message: **${ping}** ms\n Websocket: **${Math.round(this.client.ping)}** ms`);
    }
};