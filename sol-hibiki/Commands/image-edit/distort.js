const Command = require('../../Structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { get } = require('snekfetch');
 

module.exports = class DistortCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'distort',
            aliases: ['under-water'],
            group: 'image-edit',
            memberName: 'distort',
            description: 'Draws an image or a user\'s avatar but distorted.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [
                {
                    key: 'level',
                    prompt: 'What level of distortion would you like to use?',
                    type: 'integer'
                },
                {
                    key: 'image',
                    prompt: 'What image would you like to edit?',
                    type: 'image|avatar',
                    default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
                }
            ]
        });
    }

    async run(msg, { level, image }) {
        const { distort } = this.client.modules.Canvas;
        try {
            const { body } = await get(image);
            const data = await loadImage(body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            distort(ctx, level, 0, 0, data.width, data.height);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
            return msg.say({ files: [{ attachment, name: 'distort.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
