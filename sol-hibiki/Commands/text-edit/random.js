const Command = require('../../Structures/Command');

module.exports = class Random extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: ['number'],
            group: 'text-edit',
            memberName: 'random',
            description: 'Get a random number between <max> and <min>.',
            args: [{
                key: 'maximum',
                prompt: 'What would be the maximum number?',
                type: 'integer',
            }, {
                key: 'minimum',
                prompt: 'What would be the minimum number?',
                type: 'integer'
            }]
        });
    }

    run(msg, { maximum, minimum }) {
        msg.say(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
    }
};
