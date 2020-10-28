const { Command } = require('discord-akairo');
const { get } = require('node-superfetch');
const Logger = require('../../util/Logger');

class LewdKitsuneCommand extends Command {
    constructor() {
        super('lewdkitsune', {
            aliases: ['lewd-kitsune'],
            category: 'nsfw',
            description: { content: 'Responds with a random lewd kitsune image. [NSFW]' }
        });
    }

    async exec(msg) {
        try {
            const { body } = await get('https://nekobot.xyz/api/image?type=lewdkitsune');
            if (body.nsfw && !msg.channel.nsfw) {
                return msg.util.send('**::** This image is NSFW. Execute this command in a NSFW channel.');
            }
            return msg.util.send({ files: [body.message] });
        } catch (err) {
            Logger.error('**::** Error sending NSFW content:');
            Logger.stacktrace(err);
            return msg.util.send(`**::** Failed to send NSFW content \`${err.message}\`.`);
        }
    }
}

module.exports = LewdKitsuneCommand;