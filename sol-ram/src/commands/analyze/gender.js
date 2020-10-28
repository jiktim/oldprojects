const { Command } = require('discord-akairo');
const { get } = require('node-superfetch');
const Logger = require('../../util/Logger');

class GenderCommand extends Command {
    constructor() {
        super('gender', {
            aliases: ['gender'],
            category: 'analyze',
            description: { content: 'Check a member/user\'s gender.' },
            args: [{
                id: 'firstName',
                match: 'content',
                type: 'string',
                prompt: {
                    start: 'What is the first name?',
                    retry: 'Please provide a valid first name.'
                }
            }, {
                id: 'lastName',
                match: 'content',
                type: 'string',
                optional: true,
                prompt: {
                    start: 'What is the last name?',
                    retry: 'Please provide a valid last name.'
                }
            }],
        });
    }

    async gender(firstName, lastName) {
        const { body } = await get(`https://api.namsor.com/onomastics/api/json/gender/${firstName}/${lastName}`);
        if (body.gender === 'unknown') return `I have no idea what gender ${body.firstName} is..`;
        return `I'm **${Math.abs(body.scale * 100)}**% sure **${body.firstName}** is a **${body.gender}** name.`;
    }

    async exec(msg, { first, last }) {
        try {
            const gen = await this.gender(first, last);
            return msg.util.send({ embed: {
                color: 0xE91E63,
                title: 'Gender',
                description: gen
            } });
        } catch (err) {
            Logger.error('Error sending gender data:');
            Logger.stacktrace(err);
            return msg.util.send(`Failed to send gender data \`${err.message}\`.`);
        }
    }
}

module.exports = GenderCommand;