const { Collection, MessageEmbed } = require('discord.js');

const Client = require('./Megumin');
const config = require('./config');

const Megumin = new Client(config);

Megumin.build();

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chu) => {
    var chunk = chu.toString();
    if (chunk.startsWith('exit')) {
        process.exit(0);
    } else if (chunk.startsWith('eval')) {
        let slice = chunk.slice('eval'.length);
        try { console.log(eval(slice)); } catch (err) { console.error(err); }
    }
});

Megumin.on('ready', () => console.log('Ready!'));
Megumin.on('message', (msg) => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = Megumin.commands.get(commandName)
		|| Megumin.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.disabled) {
        let embed = new MessageEmbed()
            .setTitle('`❌` Can\'t execute command')
            .setColor(0xff0000)
            .setDescription(`Command \`${command.name}\` has been disabled. Please wait some time, until the bot owner(s) decide to enable it.`);
        return msg.channel.send(embed);
    }

    if (command.guildOnly && msg.channel.type !== 'text') {
        let embed = new MessageEmbed()
            .setTitle('`❌` Can\'t execute command in DMs')
            .setColor(0xff0000)
            .setDescription(`Please execute \`${command.name}\` on a text channel.`);
        return msg.channel.send(embed);
    }

    if (command.args && !args.length) {
        let embed = new MessageEmbed()
            .setTitle('`❌` No arguments')
            .setColor(0xff0000)
            .setDescription(`You provided 0 arguments for command \`${command.name}\`.`);

        if (command.usage) {
            embed.addField('Usage', `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\`.`);
        }

        return msg.channel.send(embed);
    }

    if (!Megumin.cooldowns.has(command.name)) {
        Megumin.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = Megumin.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(msg.author.id)) {
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            let embed = new MessageEmbed()
                .setTitle('`❌` Command cooldown')
                .setColor(0xff0000)
                .setDescription(`Please wait ${timeLeft.toFixed(1)} second(s) before you use the \`${command.name}\` again.`);
            return msg.channel.send(embed);
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }

    try {
        command.execute(msg, args);
    } catch (err) {
        console.error(err);
        let embed = new MessageEmbed()
            .setTitle('`❌` Command error')
            .setColor(0xff0000)
            .setDescription(`An error occured for command ${command.name}. Please contact <@${config.owner}> with this error: \`${err.message}\`.`);
        return msg.channel.send(embed);
    }
});