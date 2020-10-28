const { CommandoClient } = require('discord.js-commando');
const { readdirSync } = require('fs');
const { version } = require('../package');
const { COLOR, TOKEN } = process.env;

const winston = require('winston');
const Database = require('../Structures/PostgreSQL');
const Redis = require('./Redis');
const Command = require('../Handlers/Command');
const Event = require('../Handlers/Event');

module.exports = class Hibiki extends CommandoClient {
    constructor (options) {
        super (options);
        this.color = COLOR;
        this.commands = this.registry.commands;
        this.cmdsUsed = 0;
        this.database = Database.db;
        this.logger = winston;
        this.modules = {};
        this.redis = Redis.db;
        this.version = `v${version}`;

        for (const module of readdirSync('./Modules/')) {
            const moduleName = module.split('.')[0];
            this.modules[moduleName] = require(`../Modules/${moduleName}`);
        }

        this.encryptor = new this.modules.Encryption();

        process.on('unhandledRejection', async (err) => {
            if (err.code === 50006 || err.code === 50007 || err.code === 50013) return;
            await this.logger.error(`[UNHANDLED PROMISE REJECTION]:\n${err.stack}`);
        });

        process.on('SIGINT', async () => {
            this.logger.info(`[PROCESS] Received SIGINT, terminating bot.\nTotal commands ran today: ${this.cmdsUsed}`);
            await process.exit();
        });

    }

    async dbInit () {
        await Database.start();
        await Redis.start();
    }

    async start () {
        await this.logger.info('[COMMAND HANDLER]: Loading command handler..');
        await Command(this);
        await this.logger.info('[COMMAND HANDLER]: Loaded.');

        await this.logger.info('[EVENT HANDLER]: Loading event handler..');
        await Event(this);
        await this.logger.info('[EVENT HANDLER]: Succesfully loaded.');

        await this.logger.info('[DISCORD]: Connecting to Discord..');
        await this.login(TOKEN);

        await this.dbInit();
    }
};