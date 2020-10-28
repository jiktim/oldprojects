const { ArgumentType } = require('discord.js-commando');
const Raven = require('raven');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

module.exports = class CodeArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'code');
    }

    validate(value) {
        return Boolean(value);
    }

    async parse(code, msg) {
        if (/^[0-9]+$/.test(code)) {
            try {
                const message = await msg.channel.messages.fetch(code);
                code = message.content;
            } catch (err) {
                Raven.captureException(err);
                return { code, lang: null };
            }
        }
        if (codeblock.test(code)) {
            const parsed = codeblock.exec(code);
            return {
                code: parsed[2],
                lang: parsed[1] ? parsed[1].toLowerCase() : null
            };
        }
        return { code, lang: null };
    }
};
