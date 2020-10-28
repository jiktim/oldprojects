const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class Hug extends Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            group: 'roleplay',
            memberName: 'hug',
            description: 'Hug whoever you want.~ :3',
            examples: ['hug @User#1234'],
            args: [{
                key: 'user',
                prompt: 'Which user(s) do you want to hug?~\n',
                type: 'user',
                infinite: true
            }]
        });
    }
    async run(msg, { user }) {
        const users = user ? user.map(u => u.username).join(', ') : user.username;
        const { body } = await get('https://rra.ram.moe/i/r?type=hug');
        if (user == this.client.user) {
            return msg.say('*hugs you back*~ ❤', { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        if (user == msg.author) {
            return msg.say(`I-I'm sorry you're lonely ${user}. *hugs*~ ❤`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        return msg.say(`*${msg.author.toString()} hugs ${users}*~ ❤`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
    }
};
