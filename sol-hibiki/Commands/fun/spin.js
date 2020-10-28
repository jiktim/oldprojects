const Command = require('../../Structures/Command');

module.exports = class Spin extends Command {
    constructor(client) {
        super(client, {
            name: 'spin',
            group: 'fun',
            memberName: 'spin',
            description: 'Spins a fidget spinner!'
        });
    }

    run (msg) {
        const { duration } = this.client.modules.Util;
        const spinAmount = Math.floor(Math.random() * (5000 - 90000 + 1)) + 90000;
        msg.say('߷ Spinning fidget spinner..');
        setTimeout(() => {
            msg.reply(`your spinner spun for ${duration(spinAmount)}!`);
        }, spinAmount);
    }
};
