const Command = require('../../Structures/Command');
const { post } = require('snekfetch');
const { oneLine, stripIndents } = require('common-tags');
 

module.exports = class Strawpoll extends Command {
    constructor(client) {
        super(client, {
            name: 'strawpoll',
            aliases: ['poll'],
            group: 'utility',
            memberName: 'strawpoll',
            description: 'Create a strawpoll.',
            details: stripIndents`Create a strawpoll.
				The first argument is always the title, if you provide it, otherwise your username will be used!
				If you need to use spaces in your title make sure you put them in SingleQuotes => \`'topic here'\``,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'title',
                prompt: 'What title would you like the strawpoll to have?\n',
                type: 'string',
                validate: title => {
                    if (title.length > 200) {
                        return `
								Your title was ${title.length} characters long.
								Please limit your title to 200 characters.
							`;
                    }
                    return true;
                }
            }, {
                key: 'options',
                prompt: oneLine`
						What options would you like to have?
						Every message you send will be interpreted as a single option.\n
					`,
                type: 'string',
                validate: option => {
                    if (option.length > 160) {
                        return `
							    Your option was ${option.length} characters long.
								Please limit your option to 160 characters.
							`;
                    }
                    return true;
                },
                infinite: true
            }]
        });
    }

    async run(msg, { title, options }) {
        if (options.length < 2) return msg.say('Please provide 2 or more options.');
        if (options.length > 31) return msg.say('Please provide less than 31 options.');

        try {
            const { body } = await post('https://www.strawpoll.me/api/v2/polls')
                .set({ 'Content-Type': 'application/json' })
                .send({ title, options });

            return msg.say(stripIndents`Poll created!
            \`${body.title}\`
            <https://www.strawpoll.me/${body.id}>
    `);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
