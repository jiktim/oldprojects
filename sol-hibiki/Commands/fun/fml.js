const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class FML extends Command {
    constructor(client) {
        super(client, {
            name: 'fml',
            aliases: ['fuck-my-life'],
            group: 'fun',
            memberName: 'fml',
            description: 'Responds with a fml story.'
        });
    }

    async run(msg) {
        const { body } = await get('https://api.alexflipnote.xyz/fml');
        try {
            return msg.say(body.text);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
