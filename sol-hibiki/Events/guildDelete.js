const { MessageEmbed } = require('discord.js');
const { CHANNEL_LOG } = process.env;

module.exports = async (client, guild) => {
    const embed = new MessageEmbed()
        .setTitle(`Server left! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0xff0000)
        .setFooter(`${client.user.username} is now in ${client.guilds.size} servers. | v${client.version}`)
        .addField('Name', guild.name, true)
        .addField('ID', guild.id, true)
        .addField('Owner', `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField('Member count', guild.memberCount, true)
        .addField('Created at', `\`${guild.createdAt.toLocaleString()}\``, true);
    await client.channels.get(CHANNEL_LOG).send({ embed });
    await client.logger.info(`[GUILD LEFT]: ${guild.name} (${guild.id})`);
};