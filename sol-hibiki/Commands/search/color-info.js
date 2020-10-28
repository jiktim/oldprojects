const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const { get } = require('snekfetch');

module.exports = class ColorInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'color-info',
            aliases: ['colour-info'],
            group: 'search',
            memberName: 'color-info',
            description: 'Gives information about providen HEX color.',
            examples: ['color-info FFFFFF'],
            args: [{
                key: 'color',
                prompt: 'Please, provide a HEX color.\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { color }) {

        try {
            const { body } = await get(`https://api.alexflipnote.xyz/colour/${color}`);
            msg.say(stripIndents`
                **Name**: ${body.name}
                **HEX**: ${body.hex}
                **RGB**: ${body.rgb}
            `, { files: [{ attachment: body.image, name: 'color.png '}] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);    
        }
    }
};