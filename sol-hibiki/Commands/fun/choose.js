const Command = require('../../Structures/Command');

module.exports = class ChooseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'choose',
            group: 'fun',
            memberName: 'choose',
            description: 'Chooses between things.',
            args: [{
                key: 'choices',
                prompt: 'What choices do you want me pick from?',
                type: 'string',
                infinite: true
            }]
        });
    }

    run(msg, { choices }) {
        const choice = choices[Math.floor(Math.random() * choices.length)];
        return msg.say(`I choose **${choice}**!`);
    }
};
