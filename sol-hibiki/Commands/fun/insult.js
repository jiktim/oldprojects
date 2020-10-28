const Command = require('../../Structures/Command');
const insults = require('../../Assets/json/insults');

module.exports = class Insult extends Command {
    constructor(client) {
        super(client, {
            name: 'insult',
            group: 'fun',
            memberName: 'insult',
            description: 'Responds with a random insult.',
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Who do you want to insult?',
                type: 'user',
                default: msg => msg.author
            }]
        });
    }

    run(msg, { user }) {
        const random = type => type[Math.floor(Math.random() * type.length)];
        if (user === this.client.user) {
            return msg.say(`I don't think this is a great idea, ${msg.author.username}.`);
        }
        msg.say(`${user.username}, you know what? You're nothing but ${random(insults.start)} ${random(insults.middle)} ${random(insults.end)}`);
    }
};
