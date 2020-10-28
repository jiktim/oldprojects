const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');
const { list } = require('../../Modules/Util');
const { TRANSLATE_KEY } = process.env;
const codes = require('../../Assets/json/translate');

module.exports = class Translate extends Command {
    constructor(client) {
        super(client, {
            name: 'translate',
            aliases: ['yandex', 'yandex-translate'],
            group: 'utility',
            memberName: 'translate',
            description: 'Translates your text into a providen language. Powered by Yandex Translate.',
            details: `\`Codes\`: ${Object.keys(codes).join(', ')}`,
            args: [{
                key: 'text',
                prompt: 'What text would you like to translate?',
                type: 'string',
                max: 500
            }, {
                key: 'target',
                prompt: `Which language would you like to translate your text to? Either ${list(Object.keys(codes), 'or')}.`,
                type: 'string',
                validate: target => {
                    const value = target.toLowerCase();
                    if (codes[value] || Object.keys(codes).find(key => codes[key].toLowerCase() === value)) return true;
                    return `Invalid target, please enter either ${list(Object.keys(codes), 'or')}.`;
                },
                parse: target => {
                    const value = target.toLowerCase();
                    if (codes[value]) return value;
                    return Object.keys(codes).find(key => codes[key].toLowerCase() === value);
                }
            },
            {
                key: 'base',
                prompt: `Which language would you like to use as the base? Either ${list(Object.keys(codes), 'or')}.`,
                type: 'string',
                default: '',
                validate: base => {
                    const value = base.toLowerCase();
                    if (codes[value] || Object.keys(codes).find(key => codes[key].toLowerCase() === value)) return true;
                    return `Invalid base, please enter either ${list(Object.keys(codes), 'or')}.`;
                },
                parse: base => {
                    const value = base.toLowerCase();
                    if (codes[value]) return value;
                    return Object.keys(codes).find(key => codes[key].toLowerCase() === value);
                }
            }]
        });
    }

    async run(msg, { text, target, base }) {
        try {
            const { body } = await get('https://translate.yandex.net/api/v1.5/tr.json/translate')
                .query({
                    key: TRANSLATE_KEY,
                    text,
                    lang: base ? `${base}-${target}` : target
                });
            const lang = body.lang.split('-');
            const embed = new MessageEmbed()
                .setColor(0xFF0000)
                .setAuthor('Yandex Translate', 'https://i.imgur.com/HMpH9sq.png')
                .setFooter(this.client.version)
                .addField(`❯ From: ${codes[lang[0]]}`, text)
                .addField(`❯ To: ${codes[lang[1]]}`, body.text[0]);
            return msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
