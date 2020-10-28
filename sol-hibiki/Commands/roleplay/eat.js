const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class Eat extends Command {
    constructor(client) {
        super(client, {
            name: 'eat',
            group: 'roleplay',
            memberName: 'eat',
            description: 'Eat whoever you want.~ :3 hehe',
            examples: ['eat @User#1234'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to eat?~\n',
                type: 'user',
                infinite: true
            }]
        });
    }
    async run(msg, { user }) {
        const users = user ? user.map(u => u.username).join(', ') : user.username;
        const { body } = await get('https://rra.ram.moe/i/r?type=eat');
        if (user == this.client.user) {
            return msg.say('*eats you back*~ ❤', { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        if (user == msg.author) {
            return msg.say(`${user} is eating themselves..?`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        return msg.say(`*${msg.author.toString()} eats ${users}*~ ❤`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
    }
};
