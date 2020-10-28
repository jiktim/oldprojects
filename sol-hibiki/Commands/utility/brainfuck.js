const Command = require('../../Structures/Command');

const Brainfuck = require('brainfuck-node');
const brainfuck = new Brainfuck();

module.exports = class Brainfuck extends Command {
    constructor(client) {
        super(client, {
            name: 'brainfuck',
            aliases: ['bf'],
            group: 'utility',
            memberName: 'brainfuck',
            description: 'Executes a brainfuck.',
            examples: ['brainfuck <code>'],
            args: [{
                key: 'code',
                prompt: 'What would you like to execute?\n',
                type: 'string'
            }]
        });
    }

    run(msg, { code }) {
        try {
            let result = brainfuck.execute(code, code);
            if (result.length > 2000) return msg.say('Result is more than 2,000 characters.');
            return msg.say(result.output);
        } catch (err) {
            return msg.say(err.message);
        }
    }
};
