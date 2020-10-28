const Command = require('../../Structures/Command');
const { hash } = require('../../Modules/Util');

module.exports = class SHA256Command extends Command {
    constructor(client) {
        super(client, {
            name: 'sha256',
            aliases: ['sha-256', 'sha-256-hash'],
            group: 'encryption',
            memberName: 'sha-256',
            description: 'Creates a hash of text with the SHA256 algorithm.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to create an SHA256 hash of?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(hash(text, 'sha256'));
    }
};