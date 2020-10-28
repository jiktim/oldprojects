const { Command } = require('discord.js-commando');
const Raven = require('raven');

module.exports = class CommandStruct extends Command {
    constructor(client, opts) {
        super(client, opts);

        this.captureError = (err) => {
            Raven.captureException(err);
        };
    }
};