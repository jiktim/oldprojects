const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class OwO extends Command {
    constructor(client) {
        super(client, {
            name: 'owo',
            group: 'image',
            memberName: 'owo',
            description: 'Responds with a random OwO image.',
            examples: ['owo']
        });
    }

    async run(msg) {
        try {
            const { body } = await get('https://rra.ram.moe/i/r?type=owo');
            return msg.say({ files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: body.path }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
