const Command = require('../../Structures/Command');

module.exports = class RateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rate',
            aliases: ['rate-waifu'],
            group: 'fun',
            memberName: 'rate',
            description: 'Rates something.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to rate?',
                type: 'string',
                max: 1950
            }]
        });
    }

    run(msg, { thing }) {
        return msg.say(`I'd give ${thing} a ${Math.floor(Math.random() * 10) + 1}/10!`);
    }
};