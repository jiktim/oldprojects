const { Command } = require('discord-akairo');
const Random = require('random-js');
const texts = require('../../assets/static/coolness');
const { MessageEmbed } = require('discord.js');
const { owner } = require('../../../config');

class CoolnessCommand extends Command {
    constructor() {
        super('coolness', {
            aliases: ['coolness'],
            category: 'analyze',
            description: { content: 'Check member/user\'s coolness.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }

    exec(msg, { user }) {
        const authorUser = user.id === msg.author.id;
        if (user.id === this.client.user.id) {
            const embed = new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
                .setDescription('**::** Why would you ask? Of course I\'m the very best bot, like no one ever was.');
            return msg.embed(embed);
        }
        if (owner.includes(user)) {
            if (authorUser) {
                const embed = new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                    .setColor(0xE91E63)
                    .setDescription('**::** You\'re the best bot owner! ♥');
                return msg.embed(embed);
            }
            const embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setColor(0xE91E63)
                .setDescription(`**::** Don't tell them I said this, but I think ${user.username} smells like a paper.`);
            return msg.embed(embed);
        }
        const random = new Random(Random.engines.mt19937().seed(user.id));
        const coolness = random.integer(0, texts.length - 1);
        const embed = new MessageEmbed()
            .setAuthor(msg.author ? user.username : msg.author.username, msg.author ? user.displayAvatarURL() : msg.author.displayAvatarURL())
            .setColor(0xE91E63)
            .setDescription(`**::** ${authorUser ? 'You are' : `${user.username} is`} ${texts[coolness]}`);
        return msg.embed(embed);
    }
}

module.exports = CoolnessCommand;