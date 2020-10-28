const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Achievement extends Command {
    constructor(client) {
        super(client, {
            name: 'achievement',
            aliases: ['achieve'],
            group: 'image-edit',
            memberName: 'achievement',
            description: 'Sends a Minecraft-like achievement with your text.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'text',
                prompt: 'What should the achievement text be?',
                type: 'string',
                validate: text => {
                    if (text.length < 25) return true;
                    return 'Please keep the text under 25 characters.';
                }
            }, {
                key: 'item',
                prompt: 'Select the item ID. (max: 39).',
                type: 'integer',
                default: 1
            }]
        });
    }

    async run(msg, { text, item }) {
        try {
            const { body } = await get('https://www.minecraftskinstealer.com/achievement/a.php')
                .query({ i: item, h: 'Achievement get!', t: text });
            await msg.say({ files: [{ 
                attachment: body, name: 'achievement.png' 
            }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
