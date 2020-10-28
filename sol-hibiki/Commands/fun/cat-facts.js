const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class CatFacts extends Command {
    constructor(client) {
        super(client, {
            name: 'cat-facts',
            aliases: ['cat-fact', 'kitten-fact'],
            group: 'fun',
            memberName: 'cat-facts',
            description: 'Responds with a random cat/kitten fact.'
        });
    }

    async run(msg) {
        const { body } = await get('https://catfact.ninja/fact');
        try {
            return msg.say(body.fact);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
