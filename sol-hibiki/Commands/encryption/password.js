const Command = require('../../Structures/Command');

module.exports = class Password extends Command {
    constructor(client) {
        super(client, {
            name: 'password',
            aliases: ['pass'],
            group: 'encryption',
            memberName: 'password',
            description: 'Creates a random password.',
            details: 'Add the `--no-dm` flag to avoid DMs.'
        });
    }

    generatePass() {
        return [...Array(19)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
    }

    async run(msg, args) {
        if (args === '--no-dm') {
            return await msg.say(`🔑 **${msg.author.username}**, here's your random generated password: ${this.generatePass()}`);
        } else {
            await msg.author.send(`🔑 Here's your random password: ${this.generatePass()}`);
            await msg.reply('succesfully generated a random password, check your DMs.');
        }
    }
};