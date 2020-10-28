const Command = require('../../Structures/Command');
const Tag = require('../../Models/Tag');

module.exports = class TagDeleteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delete-tag',
            aliases: [
                'tag-delete',
                'tag-del',
                'tag-server-del',
                'tag-servertag-del',
                'delete-servertag',
                'delete-server',
                'servertag-delete',
                'server-delete',
                'del-tag',
                'del-servertag',
                'del-server',
                'servertag-del',
                'server-del',
            ],
            group: 'tags',
            memberName: 'delete',
            description: 'Deletes a tag.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'name',
                label: 'tagname',
                prompt: 'what tag would you like to delete?\n',
                type: 'string',
                parse: str => str.toLowerCase()
            }]
        });
    }

    async run(msg, { name }) {
        const staffRole = this.client.isOwner(msg.author) || await msg.member.permissions.has('MANAGE_MESSAGES');
        const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
        if (!tag) return msg.say(`A tag with the name **${name}** doesn't exist, ${msg.author}`);
        if (tag.userID !== msg.author.id && !staffRole) return msg.say(`You can only delete your own tags, ${msg.author}`);

        Tag.destroy({ where: { name, guildID: msg.guild.id } });

        return msg.say(`The tag **${name}** has been deleted, ${msg.author}`);
    }
};
