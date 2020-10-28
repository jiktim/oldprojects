const Command = require('../../Structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { get } = require('snekfetch');

module.exports = class InvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invert',
            group: 'image-edit',
            memberName: 'invert',
            description: 'Draws an image or a user\'s avatar but inverted.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'image',
                prompt: 'What image would you like to edit?',
                type: 'image|avatar',
                default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
            }]
        });
    }

    async run(msg, { image }) {
        const { invert } = this.client.modules.Canvas;
        try {
            const { body } = await get(image);
            const data = await loadImage(body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            invert(ctx, 0, 0, data.width, data.height);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
            return msg.say({ files: [{ attachment, name: 'invert.png' }] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};