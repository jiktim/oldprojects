require('dotenv').config();

const Raven = require('raven');
const Client = require('./Structures/Hibiki');
const SequelizeProvider = require('./Providers/Sequelize');

const Currency = require('./Structures/Currency');
const Experience = require('./Structures/Experience');

const { blacklist } = require('./Assets/json/messages');

const { FriendlyError } = require('discord.js-commando');

const { PREFIX, OWNERS, SENTRY, INVITE } = process.env;

const Hibiki = new Client({ 
    commandPrefix: PREFIX, disableEveryone: true, invite: INVITE, owner: OWNERS.split(','), unknownCommandResponse: false
});

Hibiki.start();

if (SENTRY) {
    Raven.config(SENTRY).install();
}

Hibiki.dispatcher.addInhibitor(msg => {
    const blacklistCheck = Hibiki.provider.get('global', 'blacklistUsers', []);
    if (!blacklistCheck.includes(msg.author.id)) return false;
    const message = blacklist
        .replace(/(<user>)/, msg.author.username)
        .replace(/(<bot>)/, Hibiki.user.username);
    return msg.say(message);
});

let earnedRecently = [];
let gainedXPRecently = [];

Hibiki
    .once('ready', () => Currency.leaderboard())
    .on('message', async (msg) => {
        if (!msg.guild || !msg.guild.settings.get('antiInvite')) return;
        if (msg.author.bot) return;
            
        if (/(discord(\.gg\/|app\.com\/invite\/|\.me\/|\.io\/))/gi.test(msg.content)) {
            if (msg.author.bot || msg.member.permissions.has('MANAGE_SERVER') || msg.member.roles.has(msg.guild.settings.get('antiInviteRole'))) return;
            if (!msg.channel.permissionsFor(Hibiki.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) return;
            msg.delete();
            msg.say(`Anti-invite has been turned on for ${msg.guild.name}. You can't post any invites.`);
        }
        const channelLocks = Hibiki.provider.get(msg.guild.id, 'locks', []);
        if (channelLocks.includes(msg.channel.id)) return;
        if (!earnedRecently.includes(msg.author.id)) {
            const hasImageAttachment = msg.attachments.some(attachment =>
                attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/)
            );
            const moneyEarned = hasImageAttachment
                ? Math.ceil(Math.random() * 7) + 5
                : Math.ceil(Math.random() * 7) + 1;

            Currency._changeBalance(msg.author.id, moneyEarned);

            earnedRecently.push(msg.author.id);
            setTimeout(() => {
                const index = earnedRecently.indexOf(msg.author.id);
                earnedRecently.splice(index, 1);
            }, 8000);
        }

        if (!gainedXPRecently.includes(msg.author.id)) {
            const xpEarned = Math.ceil(Math.random() * 9) + 3;
            const oldLevel = await Experience.getLevel(msg.author.id);

            Experience.addExperience(msg.author.id, xpEarned).then(async () => {
                const newLevel = await Experience.getLevel(msg.author.id);
                if (newLevel > oldLevel) {
                    Currency._changeBalance(msg.author.id, 100 * newLevel);
                }
            }).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err

            gainedXPRecently.push(msg.author.id);
            setTimeout(() => {
                const index = gainedXPRecently.indexOf(msg.author.id);
                gainedXPRecently.splice(index, 1);
            }, 60 * 1000);
        }
    })
    .on('commandRun', (cmd, promise, msg, args) => {
        Hibiki.cmdsUsed++;
        Hibiki.logger.info('A command has been triggered.', { 
            cmd: cmd.memberName, 
            user: `${msg.author.tag} (${msg.author.id})`, 
            guild: msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'PM',
            args: Object.values(args).length ? `${Object.values(args)}` : 'none', 
        });
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return;
        Hibiki.logger.error('A command has been errored.', { 
            cmd: cmd.memberName, 
            error: err
        });
    })
    .on('commandBlocked', (msg, reason) => {
        Hibiki.logger.error('A command has been blocked.', { 
            cmd: `${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}`, 
            user: `${msg.author.tag} (${msg.author.id})`,
            guild: `${msg.guild.name} (${msg.guild.id})`,
            reason
        });
    })
    .on('commandPrefixChange', (guild, prefix) => {
        Hibiki.logger.info('Prefix changed.', { 
            prefix: `${prefix || 'to default'}`,
            where: `${guild.name} ${guild.id}` || 'globally'
        });
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        Hibiki.logger.info('Command status changed.', { 
            cmd: `${command.groupID}:${command.memberName}`,
            status: `${enabled ? 'enabled' : 'disabled'}`,
            where: `${guild.name} ${guild.id}` || 'globally'
        });
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        Hibiki.logger.info('Group status changed.', { 
            group: group.id,
            status: `${enabled ? 'enabled' : 'disabled'}`,
            where: `${guild.name} ${guild.id}` || 'globally'
        });
    });

Hibiki.setProvider(new SequelizeProvider(Hibiki.database)).catch(Hibiki.logger.error);