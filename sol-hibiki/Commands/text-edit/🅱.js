const Command = require('../../Structures/Command');

module.exports = class B extends Command {
    constructor(client) {
        super(client, {
            name: '🅱',
            aliases: ['b'],
            group: 'text-edit',
            memberName: '🅱',
            description: 'Replaces a text that contains b with 🅱.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to 🅱?',
                type: 'string',
                validate: text => {
                    if (text.replace(/b/gi, '🅱').length < 2000) return true;
                    return 'Sorry, your text is too long.';
                }
            }]
        });
    }

    run(msg, { text }) {
        if (!text.includes('b' || 'B')) return msg.say('No `B` word found.');
        return msg.say(text.replace(/b/gi, '🅱'));
    }
};
