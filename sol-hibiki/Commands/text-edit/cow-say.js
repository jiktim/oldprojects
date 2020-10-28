const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class CowSay extends Command {
    constructor(client) {
        super(client, {
            name: 'cow-say',
            aliases: ['cow'],
            group: 'text-edit',
            memberName: 'cow-say',
            description: 'Responds with a cow saying your text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like the cow to say?',
                type: 'string',
                max: 1500
            }]
        });
    }

    async run(msg, { text }) {
        try {
            const { body } = await get('http://cowsay.morecode.org/say')
                .query({
                    message: text,
                    format: 'json'
                });
            return msg.code(null, body.cow);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
