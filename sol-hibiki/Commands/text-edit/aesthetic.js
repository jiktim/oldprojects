const Command = require('../../Structures/Command');

module.exports = class Aesthetic extends Command {
    constructor(client) {
        super(client, {
            name: 'aesthetic',
            aliases: ['vaporwave'],
            group: 'text-edit',
            memberName: 'aesthetic',
            description: 'Aestheticify your text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to aesthetic-ify?\n',
                type: 'string',
            }]
        });
    }

    vaporwave(input) {
        return input.replace(/[a-zA-Z0-9!\?\.'";:\]\[}{\)\(@#\$%\^&\*\-_=\+`~><]/g, (c) => String.fromCharCode(0xFEE0 + c.charCodeAt(0))).replace(/ /g, '　'); // eslint-disable-line
    }
    run(msg, { text }) {
        return msg.say(this.vaporwave(text));
    }
};
