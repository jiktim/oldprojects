const Command = require('../../Structures/Command');

module.exports = class Clap extends Command {
    constructor(client) {
        super(client, {
            name: 'clap',
            aliases: ['clapping', '👏'],
            group: 'text-edit',
            memberName: 'clap',
            description: 'Edits your text with a clap.',
            args: [{
                key: 'text',
                prompt: 'What 👏 text 👏 would 👏 you 👏 like 👏 to 👏 convert 👏 to 👏 clap?',
                type: 'string',
                validate: text => {
                    if (text.replace(/ /g, ' 👏 ').length < 2000) return true;
                    return 'Invalid text, your text is too long.';
                }
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(text.replace(/ /g, ' 👏 '));
    }
};
