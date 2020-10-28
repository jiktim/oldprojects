const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { full, none } = require('../../assets/static/gay');

class GayCommand extends Command {
    constructor() {
        super('gay', {
            aliases: ['gay'],
            category: 'analyze',
            description: { content: 'Check member/user\'s gayness.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }

    async exec(msg, { member } ) {
        let gayPercent;
        const embed = new MessageEmbed();

        if (member.id === this.client.user.id) {
            await embed.setDescription('I\'m underage. Pervert!');
        }

        if (none.includes(member.id)) gayPercent = 0;
        else if (full.includes(member.id)) gayPercent = 1e8;
        else if (member.id === '244509121838186497') gayPercent = 169;
        else gayPercent = gayPercent = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        if (gayPercent > 50) {
            await embed.setTitle('Gayness');
            await embed.setColor(0xE91E63);
            await embed.setDescription(`**::** **${member.user.username}** is **${gayPercent}**% gay. :gay_pride_flag: `);
        } else {
            await embed.setTitle('Gayness');
            await embed.setColor(0xE91E63);
            await embed.setDescription(`**::** **${member.user.username}** is **${gayPercent}**% gay. 🌈`);
        }

        return msg.util.send([embed]);
    }
}


module.exports = GayCommand;