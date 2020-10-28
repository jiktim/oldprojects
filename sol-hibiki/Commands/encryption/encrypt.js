const Command = require('../../Structures/Command');
 

module.exports = class Encrypt extends Command {
    constructor(client) {
        super(client, {
            name: 'encrypt',
            group: 'encryption',
            memberName: 'encrypt',
            description: 'Encrypts your text.',
            args: [{
                key: 'text',
                prompt: 'What would you like to encrypt?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        try {
            const encrypt = this.client.encryptor.encrypt(text);
            if (encrypt.length > 1024) return msg.say(this.client.modules.GithubGist(encrypt));
            return msg.say(`🔐 \`${encrypt}\``);
        } catch (err) {
            this.captureError(err);
            return msg.say('I was unable to encrypt your message.');
        }
    }
};
