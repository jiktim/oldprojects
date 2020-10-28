const Command = require('../../Structures/Command');

module.exports = class Ship extends Command {
    constructor(client) {
        super(client, {
            name: 'ship',
            group: 'roleplay',
            memberName: 'ship',
            description: 'Ship anyone you want!',
            examples: ['ship @User1#1234 @User2#1234'],
            guildOnly: true,
            args: [{
                key: 'user1',
                prompt: 'Which is the first user you want to ship?\n',
                type: 'user'
            }, {
                key: 'user2',
                prompt: 'Which is the second user you want to ship?\n',
                type: 'user'
            }]
        });
    }
    run(msg, { user1, user2 }) {
        msg.say(`❤❤ ${user1} x ${user2} ❤❤`);
    }
};
