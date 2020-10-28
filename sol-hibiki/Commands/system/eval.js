const escapeRegex = require('escape-string-regexp');
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { 
    TOKEN, DB_URL, ENCRYPT_KEY, FORTNITE_KEY, GIST, LYRICS_KEY, OSU_KEY, TRANSLATE_KEY, WEATHER_KEY, CAT_KEY, REDIS_HOST, REDIS_PORT, SENTRY
} = process.env;

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: ['ev', 'evaluate', 'js'],
            group: 'system',
            memberName: 'eval',
            ownerOnly: true,
            description: 'Evaluates asynchronous JavaScript code.',
            details: 'Only the bot owner may use this command.',
            examples: ['eval <code>'],
            args: [{
                key: 'script',
                prompt: 'What code would you like to evaluate?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        try {
            let evaled;
            evaled = eval(`(async()=>{${args.script}})();`);
            if (evaled instanceof Promise) {
                if (msg.cmd === 'eval') await evaled;
                else evaled = await evaled;
            }
            let responseTypeOf;
            if (typeof evaled !== 'string') {
                responseTypeOf = require('util').inspect(evaled, { depth: 0 });
            } else responseTypeOf = evaled;
            let data = `${responseTypeOf.replace(new RegExp(`
                ${this.client.token}|${TOKEN}|${GIST}|${DB_URL}|${OSU_KEY}|${CAT_KEY}|${TRANSLATE_KEY}|${WEATHER_KEY}|${ENCRYPT_KEY}|${FORTNITE_KEY}|${LYRICS_KEY}|${REDIS_HOST}|${REDIS_PORT}|${SENTRY}
            `, 'g'), '「ｒｅｄａｃｔｅｄ」')}`;
            if (data.length > 1024) {
                const resp = await this.client.modules.GitHubGist(data);
                return msg.say(`The eval response is more than 1024 characters, so I uploaded the contents here.\n${resp.body.html_url}`);
            }
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`${this.client.version}`)
                .addField('Output', `\`\`\`js\n${data}\`\`\``, true);
            await msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            const embed = new MessageEmbed()
                .setColor(0xFF0000)
                .setFooter(`${this.client.version}`)
                .addField('Error', `\`\`\`js\n${err.message}\`\`\``, true);
            await msg.embed(embed)
                .catch(err => this.client.logger.error(err.stack));
        }
    }
    get sensitivePattern() {
        if(!this._sensitivePattern) {
            const client = this.client;
            let pattern = '';
            if(client.token) pattern += escapeRegex(client.token);
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
        }
        return this._sensitivePattern;
    }
};