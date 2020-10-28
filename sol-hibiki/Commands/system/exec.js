const Command = require('../../Structures/Command');
const { exec } = require('child_process');
const { stripIndents } = require('common-tags');

module.exports = class Exec extends Command {
    constructor(client) {
        super(client, {
            name: 'exec',
            aliases: ['execute'],
            group: 'system',
            memberName: 'exec',
            description: 'Executes a command in shell.',
            details: 'Only the bot owner can use this command.',
            examples: ['exec <shell command>'],
            args: [{
                key: 'code',
                prompt: 'What would you like to execute?\n',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, { code }) {
        const execution = await msg.channel.send('Executing..');

        if (code.includes('rm') || code.includes('sudo') || code.includes('su') || code.includes('rd')) {
            return execution.edit('Forbidden.')
                .then((res) => res.delete({ timeout: 5000 }));
        }

        await exec(code, (err, stdout) => {
            if (err) {
                return execution.edit(`\`\`\`${stripIndents`
                    $ ${code} 
                    
                    ${err.message}
                    \`\`\`
                `}`);
            }

            return execution.edit(`\`\`\`${stripIndents`
                    $ ${code} 
            
                    ${stdout ? stdout : 'Command ran with an empty response.'}
                    \`\`\`
            `}`);
        });
    }
};
