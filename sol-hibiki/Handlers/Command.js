const { join } = require('path');

module.exports = (client) => {
    client.registry
        .registerDefaultTypes()
        .registerTypesIn(join(__dirname, '..', 'Types'))
        .registerGroups([
            ['analyze', '🤔 Analyzation commands'],
            ['economy', '💸 Economy commands'],
            ['encryption', '🔒 Encryption commands'],
            ['fun', '😄 Fun commands'],
            ['games', '🎮 Games commands'],
            ['image', '🖼 Image commands'],
            ['image-edit', '🖌 Image editing commands'],
            ['information', 'ℹ Information commands'],
            ['moderation', '🔨 Moderation commands'],
            ['nsfw', '🔞 NSFW commands'],
            ['reputation', '📈 Reputation commands'],
            ['roleplay', '❤ Roleplay commands'],
            ['search', '🔎 Search commands'],
            ['settings', '⚙ Settings commands'],
            ['social', '📟 Social commands'],
            ['system', '🔧 System commands'],
            ['tags', '🏷 Tagging commands'],
            ['text-edit', '🗨 Text editing commands'],
            ['utility', '🛠 Utility commands']
        ])
        .registerDefaultCommands({
            help: false,
            eval: false,
            ping: false,
            prefix: false,
            commandState: false
        })
        .registerCommandsIn(join(__dirname, '..', 'Commands'));
};
