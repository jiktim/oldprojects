const Command = require('../../Structures/Command');
 

module.exports = class Leave extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            aliases: ['bye'],
            group: 'system',
            memberName: 'leave',
            description: 'Leaves a guild using the guild ID.',
            details: 'Only the bot owner can use this command.',
            examples: ['leave 443432089212289034'],
            args: [{
                key: 'id',
                prompt: 'Which guild would you like to leave?\n',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, { id }) {
        const guild = this.client.guilds.get(id);

        try {
            await guild.leave();
            await msg.say(`✅ | Succesfully left \`${guild.name}\` (\`${guild.id}\`).`);
        } catch (err) {
            this.captureError(err);
            await msg.say(`❎ | Failed leaving guild ${guild.name} (${guild.id}): \`${err.message}\`.`);
            await this.client.logger.error(`[GUILD ERROR]: Failed leaving guild ${guild.name} (${guild.id}): \n${err.stack}.`);
        }
    }
};
