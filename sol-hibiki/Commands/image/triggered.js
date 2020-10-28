const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class TriggeredImage extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered-image',
            group: 'image',
            memberName: 'triggered-image',
            description: 'Responds with a random triggered image.',
            examples: ['triggered']
        });
    }
    
    async run(msg) {
        try {
            const { body } = await get('https://rra.ram.moe/i/r?type=triggered');
            return msg.say({ files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: body.path }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
