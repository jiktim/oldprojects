const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { full, none } = require('../../Assets/json/gay');

module.exports = class Gay extends Command {
    constructor(client) {
        super(client, {
            name: 'gay',
            group: 'analyze',
            memberName: 'gay',
            description: 'Check a member\'s gayness.',
            examples: ['gay @User#1234'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'Which member do you want to check?\n',
                type: 'member',
                default: msg => msg.member
            }]
        });
    }
    async run (msg, { member } ) {
        let gayPercent;
        const embed = new MessageEmbed();

        if (member.id === this.client.user.id) {
            await embed.setColor(this.client.color);
            await embed.setDescription('I\'m underage. Pervert!');
            await embed.setFooter(this.client.version);
        }

        if (none.includes(member.id)) gayPercent = 0;
        else if (full.includes(member.id)) gayPercent = 1e8;
        else if (member.id === '244509121838186497') gayPercent = 169;
        else gayPercent = gayPercent = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        if (gayPercent > 50) {
            await embed.setColor(this.client.color);
            await embed.setDescription(`**${member.user.username}** is **${gayPercent}**% gay. :gay_pride_flag: `);
            await embed.setFooter(this.client.version);
        } else {
            await embed.setColor(this.client.color);
            await embed.setDescription(`**${member.user.username}** is **${gayPercent}**% gay. 🌈`);
            await embed.setFooter(this.client.version);
        }

        return msg.embed(embed);
    }
};
