const { Command } = require('discord-akairo');
const { big } = require('../../assets/static/lund');
const { MessageEmbed } = require('discord.js');
const Random = require('random-js');

class DickCommand extends Command {
    constructor() {
        super('dick', {
            aliases: ['dick', 'lund'],
            category: 'analyze',
            description: { content: 'Check a member/user\'s dick size.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }

    async exec(msg, { user }) {
        const embed = new MessageEmbed();
        if (!big[user.id]) {
            if (user == this.client.user) await embed.setDescription('Girls don\'t have dicks. Lewd!');
            const random = new Random(Random.engines.mt19937().seed(user.id));
            await embed.setColor(0xE91E63);
            await embed.setDescription(`**::** **${user}**'s dick size is:\n**${'='.repeat(random.integer(0, 200))}D**!`);
        } else {
            await embed.setColor(0xE91E63);
            await embed.setDescription(`**::** **${user}**'s dick size is:\n**${big[user.id]}**!`);
        }
        return msg.util.send([embed]);
    }
}

module.exports = DickCommand;