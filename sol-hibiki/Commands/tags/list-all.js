const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const Tag = require('../../Models/Tag');

module.exports = class TagListAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tag-list-all',
            aliases: ['tags-all', 'list-all-tags', 'tagsall', 'listalltags'],
            group: 'tags',
            memberName: 'list-all',
            description: 'Lists all tags.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        const tags = await Tag.findAll({ where: { guildID: msg.guild.id } });
        if (!tags) return msg.say(`${msg.guild.name} doesn't have any tags, ${msg.author}. Why not add one?`);

        const allTags = tags.filter(tag => !tag.type)
            .map(tag => tag.name)
            .sort()
            .join(', ');

        return msg.say(stripIndents`**❯ All tags:**
			${allTags ? allTags : `${msg.guild.name} has no tags.`}
		`, { split: true, char: ', ' });
    }
};
