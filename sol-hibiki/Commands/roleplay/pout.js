const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class Pout extends Command {
    constructor(client) {
        super(client, {
            name: 'pout',
            group: 'roleplay',
            memberName: 'pout',
            description: 'Pout yourself.',
        });
    }
    async run(msg) {
        const { body } = await get('https://rra.ram.moe/i/r?type=pout');
        return msg.say(`*${msg.author.toString()} pouts*~ 👀`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
    }
};
