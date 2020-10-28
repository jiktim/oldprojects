const Command = require('../../Structures/Command');

module.exports = class LMGTFY extends Command {
    constructor(client) {
        super(client, {
            name: 'lmgtfy',
            aliases: ['let-me-google-that-for-you'],
            group: 'text-edit',
            memberName: 'lmgtfy',
            description: 'Let me google that for you.',
            args: [{
                key: 'text',
                prompt: 'What would you like to google for you?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(`https://lmgtfy.com/?q=${encodeURIComponent(text)}`);
    }
};