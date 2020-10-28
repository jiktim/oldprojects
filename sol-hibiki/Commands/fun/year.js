const Command = require('../../Structures/Command');
const moment = require('moment');

module.exports = class Year extends Command {
    constructor(client) {
        super(client, {
            name: 'year',
            group: 'fun',
            memberName: 'year',
            description: 'Counts how much time left until next year.'
        });
    }

    run (msg) {
        const now = new Date();
        const next = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
        msg.say(`${moment.duration(next - now).humanize()} until ${now.getFullYear() +1}! 🗓`);
    }
};