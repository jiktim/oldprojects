const Command = require('../../Structures/Command');

module.exports = class Shame extends Command {
    constructor(client) {
        super(client, {
            name: 'shame',
            aliases: ['bell', '🔔'],
            group: 'fun',
            memberName: 'shame',
            description: 'Rings a bell on the server, shaming the mentioned person.',
            examples: ['shame @User#1234'],
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Which user do you want to disgrace?\n',
                type: 'user'
            }]
        });
    }
    run(msg, { user }) {
        msg.say(`🔔 SHAME 🔔 ${user} 🔔 SHAME 🔔`);
    }
};