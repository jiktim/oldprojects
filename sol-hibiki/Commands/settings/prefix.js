const { stripIndents, oneLine } = require('common-tags');
const Command = require('../../Structures/Command');

module.exports = class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            group: 'settings',
            memberName: 'prefix',
            description: 'Shows or sets a custom command prefix.',
            format: '[prefix/"default"/"none"]',
            details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators or the bot owner may change the prefix.
			`,
            examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],

            args: [{
                key: 'prefix',
                prompt: 'What would you like to set the bot\'s prefix to?',
                type: 'string',
                max: 15,
                default: ''
            }]
        });
    }

    async run(msg, args) {
        // Just output the prefix
        if(!args.prefix) {
            const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
            return msg.say(stripIndents`
				${prefix ? `✏ | The command prefix is \`${prefix}\`.` : '❎ There is no command prefix.'}
			`);
        }

        // Check the user's permission before changing anything
        if(msg.guild) {
            if(!msg.member.permissions.has('MANAGE_SERVER') && !this.client.isOwner(msg.author)) {
                return msg.say('❎ | Only administrators may change the command prefix.');
            }
        } else if(!this.client.isOwner(msg.author)) {
            return msg.say('❎ | Only the bot owner(s) may change the global command prefix.');
        }

        // Save the prefix
        const lowercase = args.prefix.toLowerCase();
        const prefix = lowercase === 'none' ? '' : args.prefix;
        let response;
        if(lowercase === 'default') {
            if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
            const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'no prefix';
            response = `✅ | Succesfully reset the command prefix to the default (currently ${current}).`;
        } else {
            if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
            response = prefix ? `✅ | Set the command prefix to \`${args.prefix}\`.` : '✅ | Removed the command prefix entirely.';
        }

        await msg.say(response);
        return null;
    }
};
