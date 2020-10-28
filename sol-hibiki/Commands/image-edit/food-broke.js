const Command = require('../../Structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { get } = require('snekfetch');
const { join } = require('path');

module.exports = class FoodBrokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'food-broke',
            aliases: ['food-machine-broke'],
            group: 'image-edit',
            memberName: 'food-broke',
            description: 'Draws a user\'s avatar over the "Food Broke" meme.',
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
        const { contrast } = this.client.modules.Canvas;
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'Assets', 'images', 'food-broke.png'));
            const { body } = await get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(avatar, 23, 9, 125, 125);
            contrast(ctx, 23, 9, 125, 125);
            ctx.drawImage(avatar, 117, 382, 75, 75);
            contrast(ctx, 117, 382, 75, 75);
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'food-broke.png' }] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};