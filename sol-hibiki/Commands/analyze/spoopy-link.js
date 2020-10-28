const Command = require('../../Structures/Command');
 

module.exports = class SpoopyLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spoopy-link',
            group: 'analyze',
            memberName: 'spoopy-link',
            description: 'Determines if a link is spoopy or not.',
            args: [{
                key: 'site',
                prompt: 'What site do you think is spoopy?',
                type: 'string',
                parse: site => encodeURIComponent(site)
            }]
        });
    }

    async run(msg, { site }) {
        const { spoopy } = this.client.modules.API;
        try {
            const check = await spoopy(site);
            return msg.say(check);
        } catch (err) {
            this.captureError(err);
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
