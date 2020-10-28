const Command = require('../../Structures/Command');

module.exports = class Reverse extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            aliases: ['eserever'],
            group: 'text-edit',
            memberName: 'reverse',
            description: '.txet ruoy sesreveR',
            args: [{
                key: 'text',
                prompt: 'What would you like to reverse?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(text.split('').reverse().join(''));
    }
};