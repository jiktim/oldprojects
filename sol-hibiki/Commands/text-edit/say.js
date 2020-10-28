const Command = require('../../Structures/Command');

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['parrot'],
            group: 'text-edit',
            memberName: 'say',
            description: 'Says your text.',
            args: [{
                key: 'text',
                prompt: 'What would you like to say?\n',
                type: 'string',
            }]
        });
    }

    async run(msg, { text }) {
        await msg.edit(text);
    }
};
