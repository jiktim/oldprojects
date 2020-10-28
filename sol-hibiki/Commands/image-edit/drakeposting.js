const Command = require('../../Structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { get } = require('snekfetch');
const { join } = require('path');

module.exports = class DrakepostingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'drakeposting',
            aliases: ['drake', 'nah-yeah', 'naw-yeah'],
            group: 'image-edit',
            memberName: 'drakeposting',
            description: 'Draws two user\'s avatars over the "Drakeposting" meme.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'nah',
                prompt: 'Which user should be the "nah"?',
                type: 'user'
            }, {
                key: 'yeah',
                prompt: 'Which user should be the "yeah"?',
                type: 'user'
            }]
        });
    }

    async run(msg, { nah, yeah }) {
        const nahAvatarURL = nah.displayAvatarURL({ format: 'png', size: 512 });
        const yeahAvatarURL = yeah.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'Assets', 'images', 'drakeposting.png'));
            const nahAvatarData = await get(nahAvatarURL);
            const nahAvatar = await loadImage(nahAvatarData.body);
            const yeahAvatarData = await get(yeahAvatarURL);
            const yeahAvatar = await loadImage(yeahAvatarData.body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(nahAvatar, 512, 0, 512, 512);
            ctx.drawImage(yeahAvatar, 512, 512, 512, 512);
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'drakeposting.png' }] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};