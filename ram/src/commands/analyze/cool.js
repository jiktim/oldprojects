const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { full, none } = require('../../assets/static/cool');

class CoolCommand extends Command {
    constructor() {
        super('cool', {
            aliases: ['cool'],
            category: 'analyze',
            description: { content: 'Check member/user\'s coolness.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }
    
    async exec(msg, { member } ) {
        let coolPercent;
        const embed = new MessageEmbed();

        if (none.includes(member.id)) coolPercent = 0;
        else if (full.includes(member.id || this.client.user.id)) coolPercent = 1e8;
        else if (member.id === '244509121838186497') coolPercent = 169;
        else coolPercent = coolPercent = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        switch (coolPercent) {
        case coolPercent > 50:
            embed.setDescription(`**::** **${member.user.username}** is **${coolPercent}**% cool! 😎`);
            break;
        case coolPercent < 50:
            embed.setDescription(`**::** **${member.user.username}** is **${coolPercent}**% cool. 😄`);
            break;
        case coolPercent === 0:
            embed.setDescription(`**::** **${member.user.username}** is **${coolPercent}**% cool. 😦`);
            break;
        default:
            embed.setDescription(`**::** **${member.user.username}** is **${coolPercent}**% cool. 😄`);
            break;
        }

        return msg.util.send([embed]);
    }
}

module.exports = CoolCommand;