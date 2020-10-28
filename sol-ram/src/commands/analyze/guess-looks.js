const { Command } = require('discord-akairo');
const { oneLine } = require('common-tags');
const Random = require('random-js');
const genders = ['male', 'female'];
const { eyeColors, hairColors, hairStyles, extras } = require('../../assets/static/guess-looks');

class GuessLooksCommand extends Command {
    constructor() {
        super('guess-looks', {
            aliases: ['guess-looks', 'guess-my-looks', 'thebestcommandevermadejiktimstyle'],
            category: 'analyze',
            description: { content: 'Guesses what a user looks like.' },
            args: [{
                id: 'member',
                type: 'member',
                default: (msg) => msg.member
            }]
        });
    }

    exec(msg, { user }) {
        const authorUser = user.id === msg.author.id;
        const random = new Random(Random.engines.mt19937().seed(user.id));
        const gender = genders[random.integer(0, genders.length - 1)];
        const eyeColor = eyeColors[random.integer(0, eyeColors.length - 1)];
        const hairColor = hairColors[random.integer(0, hairColors.length - 1)];
        const hairStyle = hairStyles[random.integer(0, hairStyles.length - 1)];
        const age = random.integer(10, 100);
        const feet = random.integer(3, 7);
        const inches = random.integer(0, 11);
        const weight = random.integer(50, 300);
        const extra = extras[random.integer(0, extras.length - 1)];
        return msg.util.send(oneLine`
            **::** I think ${authorUser ? 'you are' : `${user.username} is`} a ${age} year old ${gender} with ${eyeColor} eyes
			and ${hairStyle} ${hairColor} hair. ${authorUser ? 'You are' : `${gender === 'male' ? 'He' : 'She'} is`}
			${feet}'${inches}" and weigh${authorUser ? '' : 's'} ${weight} pounds. Don't forget the ${extra}!
		`);
    }
}

module.exports = GuessLooksCommand;
