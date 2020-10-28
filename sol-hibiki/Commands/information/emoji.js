const Command = require('../../Structures/Command');

module.exports = class Emoji extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            aliases: ['emoji-info', 'emote', 'emote-info'],
            group: 'information',
            memberName: 'emoji',
            description: 'Get informantion on an emoji.',
            details: 'Get detailed information on the specified emoji. Both global and custom emojis will work.',
            guildOnly: false,
            args: [{
                key: 'emoji',
                prompt: 'what emoji would you like to have information on?\n',
                type: 'emoji'
            }]
        });
    }

    titleCase(str) {
        str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    async run(msg, { emoji }) {
        const info = {};
        if (emoji.id) {
            if (!emoji.id) info.server = 'Unknown Emoji';
            info.server = `${emoji.guild.name} (${emoji.guild.id})`;
            info.url = `https://cdn.discordapp.com/emojis/${emoji.id}.png`;
            info.name = emoji.name;
            info.id = emoji.id;
        } else {
            info.emoji = `${String.fromCodePoint(emoji.codePointAt(0))}\`${emoji}\``;
            info.codePoint = emoji.codePointAt(0);
            info.hex = info.codePoint.toString(16);
            info.usage = `\`\\u{${info.hex}}\``;
        }
        let out = '__**Emoji Information**__';
        for (let key in info) {
            if (key !== 'url') out += `**${this.titleCase(key)}**: ${info[key]}\n`;
        }
        return msg.embed({
            color: 3447003,
            description: out,
            image: { url: info.url ? info.url : null }
        });
    }
};
