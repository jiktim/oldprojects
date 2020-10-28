const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const checkAudit = (action) => {
    switch (action) {
    case 'GUILD_UPDATE':
        return 'Update Server';
    case 'CHANNEL_CREATE':
        return 'Create Channel';
    case 'CHANNEL_UPDATE':
        return 'Update Channel';
    case 'CHANNEL_DELETE':
        return 'Delete Channel';
    case 'CHANNEL_OVERWRITE_CREATE':
        return 'Create Channel Permissions';
    case 'CHANNEL_OVERWRITE_UPDATE':
        return 'Update Channel Permissions';
    case 'CHANNEL_OVERWRITE_DELETE':
        return 'Delete Channel Permissions';
    case 'MEMBER_KICK':
        return 'Kick Member';
    case 'MEMBER_PRUNE':
        return 'Prune Member';
    case 'MEMBER_BAN_ADD':
        return 'Ban Member';
    case 'MEMBER_BAN_REMOVE':
        return 'Unban Member';
    case 'MEMBER_UPDATE':
        return 'Update Member';
    case 'MEMBER_ROLE_UPDATE':
        return 'Update Member Roles';
    case 'ROLE_CREATE':
        return 'Create Role';
    case 'ROLE_UPDATE':
        return 'Update Role';
    case 'ROLE_DELETE':
        return 'Delete Role';
    case 'INVITE_CREATE':
        return 'Create Invite';
    case 'INVITE_UPDATE':
        return 'Update Invite';
    case 'INVITE_DELETE':
        return 'Delete Invite';
    case 'WEBHOOK_CREATE':
        return 'Create Webhook';
    case 'WEBHOOK_UPDATE':
        return 'Update Webhook';
    case 'WEBHOOK_DELETE':
        return 'Delete Webhook';
    case 'EMOJI_CREATE':
        return 'Create Emoji';
    case 'EMOJI_UPDATE':
        return 'Update Emoji';
    case 'EMOJI_DELETE':
        return 'Delete Emoji';
    case 'MESSAGE_DELETE':
        return 'Delete Messages';
    }
};

class AuditCommand extends Command {
    constructor() {
        super('audit', {
            aliases: ['audit', 'audit-log'],
            category: 'moderation',
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['VIEW_AUDIT_LOG'],
            description: { content: 'Retrieves the last audit log action.' }
        });
    }

    async exec(message) {
        const entry = await message.guild.fetchAuditLogs().then(audit => audit.entries.first());
        const embed = new MessageEmbed()
            .setAuthor(entry.executor.tag, entry.executor.displayAvatarURL())
            .setTimestamp(entry.createdTimestamp)
            .addField('Action', checkAudit(entry.action, true));
        entry.reason ? embed.addField('Reason', entry.reason, true) : '';
        entry.target ? embed.addField('Target', entry.target, true) : '';
        message.util.send([embed]);
    }
}

module.exports = AuditCommand;