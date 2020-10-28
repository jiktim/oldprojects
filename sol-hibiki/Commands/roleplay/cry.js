const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class Cry extends Command {
    constructor(client) {
        super(client, {
            name: 'cry',
            group: 'roleplay',
            memberName: 'cry',
            description: 'Are you sure you want to c-cry? 😭',
            examples: ['cry']
        });
    }
    
    async run(msg) {
        try {
            const { body } = await get('https://rra.ram.moe/i/r?type=cry');
            return msg.say(`*${msg.author.toString()} cries 😭*`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: body.path }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
