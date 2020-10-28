const Command = require('../../Structures/Command');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['pfp', 'avy'],
            group: 'information',
            memberName: 'avatar',
            description: 'Retrieve user\'s avatar',
            examples: ['avatar @User#1234'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Which user you want to get the avatar of?\n',
                type: 'user'
            }]
        });
    }
    run(msg, { user }) {
        return msg.say({ files: [{ attachment: user.displayAvatarURL({ size: 2048 }) }] });
    }
};