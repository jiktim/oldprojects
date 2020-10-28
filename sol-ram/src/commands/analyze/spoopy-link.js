const { Command } = require('discord-akairo');
const { get } = require('node-superfetch');
const { Categories } = require('../../util/Constants');
const Logger = require('../../util/Logger');

class SpoopyLinkCommand extends Command {
    constructor() {
        super('spoopy-link', {
            aliases: ['spoopy-link'],
            category: 'analyze',
            description: { content: 'Determines if a link is spoopy or not.' },
            args: [{
                id: 'site',
                match: 'content',
                type: 'string',
                prompt: {
                    start: 'What site do you think is spoopy?',
                    retry: 'Invalid site, try again.'
                }
            }]
        });
    }

    async exec(msg, { site }) {
        const message = await msg.util.send({ embed: { title: 'Scanning..', color: 0xFFFF00 }});
        try {
            const { body } = await get(`https://spoopy.link/api/${site}`);
            const reasons = body.chain.map(url => url.reasons.join(', '))
            if (body.safe) {
                return message.edit({ embed: {
                    title: 'Safe!',
                    color: 0x00FF00,
                    description: `${body.chain.map(url => `<${url.url}> ${url.safe ? '✅' : `❌ (${Categories[reasons[0]]})`}`).join('\n')}`
                } });
            } else {
                return message.edit({ embed: {
                    title: 'Not safe..',
                    color: 0xFF0000,
                    description: `${body.chain.map(url => `<${url.url}> ${url.safe ? '✅' : `❌ (${Categories[reasons[0]]})`}`).join('\n')}`
                } });
            }
        } catch (err) {
            Logger.error('Error sending gender data:');
            Logger.stacktrace(err);
            return message.edit(`Failed to send gender data \`${err.message}\`.`);
        }
    }
}

module.exports = SpoopyLinkCommand;