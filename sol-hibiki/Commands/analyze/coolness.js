const Command = require('../../Structures/Command');
const Random = require('random-js');
const texts = require('../../Assets/json/coolness');
const { MessageEmbed } = require('discord.js');

module.exports = class CoolnessCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coolness',
            group: 'analyze',
            memberName: 'coolness',
            description: 'Determines a user\'s coolness.',
            args: [{
                key: 'user',
                prompt: 'Which user do you want to determine the coolness of?',
                type: 'user',
                default: msg => msg.author
            }]
        });
    }

    run(msg, { user }) {
        const authorUser = user.id === msg.author.id;
        if (user.id === this.client.user.id) {
            const embed = new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
                .setColor(this.client.color)
                .setDescription('Why would you ask? Of course I\'m the very best bot, like no one ever was.');
            return msg.embed(embed);
        }
        if (this.client.isOwner(user)) {
            if (authorUser) {
                const embed = new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                    .setColor(this.client.color)
                    .setDescription('You\'re the best bot owner! ♥');
                return msg.embed(embed);
            }
            const embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setColor(this.client.color)
                .setDescription(`Don't tell them I said this, but I think ${user.username} smells like a paper.`);
            return msg.embed(embed);
        }
        const random = new Random(Random.engines.mt19937().seed(user.id));
        const coolness = random.integer(0, texts.length - 1);
        const embed = new MessageEmbed()
            .setAuthor(msg.author ? user.username : msg.author.username, msg.author ? user.displayAvatarURL() : msg.author.displayAvatarURL())
            .setColor(this.client.color)
            .setDescription(`${authorUser ? 'You are' : `${user.username} is`} ${texts[coolness]}`);
        return msg.embed(embed);
    }
};
