const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const os = require('os');

module.exports = class Debug extends Command {
    constructor(client) {
        super(client, {
            name: 'debug',
            group: 'information',
            memberName: 'debug',
            description: 'Debug information about this bot.',
            guarded: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    run(msg) {
        return msg.say(stripIndents`
        \`\`\`asciidoc\n
        = Debug =

        [Debug information about ${this.client.user.username}.]

        == OS ==
        • Memory usage :: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
        • CPU :: ${os.cpus()[1].model}

        • Memory :: ${this.client.modules.ConvertBytes(os.freemem())} / ${this.client.modules.ConvertBytes(os.totalmem())}

        == Versions ==

        • Node.js :: ${process.version}
        • discord.js :: ${require('discord.js/package.json').version}
        • discord.js-commando :: ${require('discord.js-commando/package.json').version}
        • ${this.client.user.username} :: ${this.client.version}

        \`\`\`
        `);
    }
};
