const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');
 

module.exports = class NPM extends Command {
    constructor(client) {
        super(client, {
            name: 'npm',
            aliases: ['npm-package'],
            group: 'search',
            memberName: 'npm',
            description: 'Searches information about an NPM package.',
            examples: ['npm <npm package name here>'],
            args: [{
                key: 'pkg',
                label: 'package',
                prompt: 'What NPM package would you like to get the information on?\n',
                type: 'string',
                parse: pkg => encodeURIComponent(pkg.replace(/ /g, '-'))
            }]
        });
    }

    async run(msg, { pkg }) {
        const { trimArray } = this.client.modules.Util;
        try {
            const { body } = await get(`https://registry.npmjs.com/${pkg}`);
            if (body.time.unpublished) return msg.say('❎ | NPM package not found.');
            const version = body.versions[body['dist-tags'].latest];
            const maintainers = trimArray(body.maintainers.map(user => user.name));
            const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
            const embed = new MessageEmbed()
                .setColor(0xCB0000)
                .setAuthor(`${body.name} (${version})`, 'https://i.imgur.com/ErKf5Y0.png', `https://www.npmjs.com/package/${pkg}`)
                .setDescription(body.description || '❎ | No description set.')
                .addField('❯ License', body.license || 'N/A', true)
                .addField('❯ Author', body.author ? body.author.name : 'N/A', true)
                .addField('❯ Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'N/A')
                .addField('❯ Maintainers', maintainers.join(', '));
            return msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            if (err.status === 404) return msg.say('❎ | NPM package not found.');
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give them this message: \`${err.message}\``);
        }
    }
};
