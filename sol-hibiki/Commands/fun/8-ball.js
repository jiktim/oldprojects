const Command = require('../../Structures/Command');
const answers = require('../../Assets/json/8-ball');

module.exports = class EightBall extends Command {
    constructor(client) {
        super(client, {
            name: '8-ball',
            group: 'fun',
            memberName: '8-ball',
            description: 'Ask your question(s) to the magical 8-Ball.',
            args: [{
                key: 'question',
                prompt: 'What do you want to ask the magical 8-Ball?',
                type: 'string',
            }]
        });
    }
    run (msg, { question }) {
        msg.say(question.endsWith('?')
            ? `❓ Question: **${question}**\n🎱 Answer: **${answers[Math.floor(Math.random() * answers.length)]}**`
            : 'That doesn\'t look as a question, try again please.');
    }
};
