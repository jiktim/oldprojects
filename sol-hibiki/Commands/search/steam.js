const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');

module.exports = class Steam extends Command {
    constructor(client) {
        super(client, {
            name: 'steam',
            aliases: ['steam-user'],
            group: 'search',
            memberName: 'steam',
            description: 'Searches user on Steam and returns information.',
            examples: ['steam <user steam id here>'],
            args: [{
                key: 'user',
                prompt: 'What is the user\'s Steam user ID?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { user }) {
        try {
            const { body } = await get(`https://api.alexflipnote.xyz/steam/user/${user}`);
            const embed = new MessageEmbed()
                .setColor(0x000000)
                .setAuthor('Steam', 'https://cdn.iconscout.com/public/images/icon/free/png-512/steam-social-media-32f32522759972ff-512x512.png', 'https://steamcommunity.com')
                .setThumbnail(body.avatars.avatarmedium)
                .addField('❯ Username',
                    body.profile.username, true)
                .addField('❯ Real name',
                    body.profile.realname || 'N/A', true)
                .addField('❯ Time created',
                    body.profile.timecreated, true)
                .addField('❯ Description',
                    body.profile.summary || 'None', true)
                .addField('❯ State',
                    body.profile.state, true)
                .addField('❯ Privacy',
                    body.profile.privacy || 'N/A', true)
                .addField('❯ Location',
                    body.profile.location || 'N/A', true)
                .addField('❯ VAC bans',
                    `${body.profile.vacbanned}`, true)
                .addField('❯ Custom URL',
                    body.id.customurl, true);
            return msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
