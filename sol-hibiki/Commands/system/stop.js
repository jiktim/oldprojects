const Command = require('../../Structures/Command');

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['shutdown', 'restart'],
            group: 'system',
            memberName: 'stop',
            description: 'Stops the bot process.',
            guarded: true
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(msg) {
        msg.say(':wave:').then(() => {
            setTimeout(() => process.exit(), 2000);
        });
    }
};