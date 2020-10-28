const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class NekoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neko',
            aliases: ['nekos'],
            group: 'image',
            memberName: 'neko',
            description: 'Responds with a random neko image. ^~^',
        });
    }

    async run(msg) {
        try {
            const { body } = await get('https://nekobot.xyz/api/image?type=neko');
            if (body.nsfw && !msg.channel.nsfw) {
                return msg.say('This random image is NSFW and I can\'t show you it in a non-NSFW channel! Please try this command again on a NSFW channel.');
            }
            return msg.say({ files: [body.message] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
