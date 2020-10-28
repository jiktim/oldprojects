const Command = require('../../Structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { get } = require('snekfetch');
const { join } = require('path');

module.exports = class BeautifulCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'beautiful',
            aliases: ['grunkle-stan'],
            group: 'image-edit',
            memberName: 'beautiful',
            description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is beautiful." meme.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user',
                default: msg => msg.author
            }]
        });
    }

    async run(msg, { user }) {
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'Assets', 'images', 'beautiful.png'));
            const { body } = await get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            ctx.drawImage(avatar, 249, 24, 105, 105);
            ctx.drawImage(avatar, 249, 223, 105, 105);
            ctx.drawImage(base, 0, 0);
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'beautiful.png' }] });
        } catch (err) {
            return msg.reply(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};