const { Command } = require('discord-akairo');
const Random = require('random-js');

class IQCommand extends Command {
    constructor() {
        super('iq', {
            aliases: ['iq', 'intelligence-quotient'],
            category: 'analyze',
            description: { content: 'Determines a user\'s IQ.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }

    exec(msg, { member }) {
        const random = new Random(Random.engines.mt19937().seed(member.id));
        const score = random.integer(20, 170);
        return msg.util.send({ embed: {
            color: 0xE91E63,
            title: 'IQ',
            description: `${member.id === msg.member.id ? 'Your' : `${member.user.username}'s`} IQ score is ${score}.`
        } });
    }
}

module.exports = IQCommand;