const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { CHANNEL_LOG } = process.env;

module.exports = async (client, guild) => {
    if (guild.members.filter(m => m.bot).length / guild.members.size >= 0.60) {
        return guild.leave();
    }
    const embed = new MessageEmbed()
        .setTitle(`New guild! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0x00ff00)
        .setFooter(`${client.user.username} is now in ${client.guilds.size} servers. | v${client.version}`)
        .addField('Name', guild.name, true)
        .addField('ID', guild.id, true)
        .addField('Owner', `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField('Member count', guild.memberCount, true)
        .addField('Created at', `\`${guild.createdAt.toLocaleString()}\``, true);
    await client.channels.get(CHANNEL_LOG).send({ embed });
    await guild.owner.send(stripIndents`
            Thank you for inviting me to \`${guild.name}\`!
            My prefix is \`${client.commandPrefix}\`. To change it, type \`${client.commandPrefix}prefix <prefix>\`.

            View all commands by typing \`${client.commandPrefix}help\`.
`);
    await client.logger.info(`[NEW GUILD]: ${guild.name} (${guild.id})`);
};