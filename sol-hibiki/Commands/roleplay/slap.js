const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class Slap extends Command {
    constructor(client) {
        super(client, {
            name: 'slap',
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slap whoever you want.~ :3 hehe',
            examples: ['slap @User#1234'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to slap?~\n',
                type: 'user',
                infinite: true
            }]
        });
    }
    async run(msg, { user }) {
        const users = user ? user.map(u => u.username).join(', ') : user.username;
        const { body } = await get('https://rra.ram.moe/i/r?type=slap');
        if (user == this.client.user) {
            return msg.say('Hey, that\'s not very nice! *slaps back*', { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        if (user == msg.author) {
            return msg.say(`a-are you sure you want to do that, ${user}?`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        return msg.say(`*${msg.author.toString()} slaps ${users}*`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
    }
};
