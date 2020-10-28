const Command = require('../../Structures/Command');
const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^'];

module.exports = class OwOCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'owo-ify',
            aliases: ['owoify'],
            group: 'text-edit',
            memberName: 'owo-ify',
            description: 'OwO.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to OwO-ify?',
                type: 'string',
                validate: text => {
                    if (this.owo(text).length < 2000) return true;
                    return 'Invalid text, your text is too long.';
                }
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(this.owo(text));
    }

    owo(text) {
        return text
            .replace(/(?:r|l)/g, 'w')
            .replace(/(?:R|L)/g, 'W')
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/N([aeiou])/g, 'Ny$1')
            .replace(/N([AEIOU])/g, 'NY$1')
            .replace(/ove/g, 'uv')
            .replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `)
            .trim();
    }
};