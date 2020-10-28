const Sequelize = require('sequelize');

const Database = require('../Structures/PostgreSQL');

let GuildSettings = Database.db.define('Guild', {
    guildID: Sequelize.STRING,
    assignableRoles: {
        type: Sequelize.JSONB(), // eslint-disable-line new-cap
        defaultValue: {}
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['guildID']
        }
    ]
});

GuildSettings.sync();

module.exports = GuildSettings;