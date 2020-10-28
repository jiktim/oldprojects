const { dbURL } = require('../../config');
const Logger = require('../util/Logger');
const Sequelize = require('sequelize');

const database = new Sequelize(dbURL, { logging: false, operatorsAliases: Sequelize.Op });

class Database {
    static get db() {
        return database;
    }

    static start() {
        database.authenticate()
            .then(() => Logger.info('Connection to Postgres database established.'))
            .then(() => Logger.info('Synchronizing Postgres database...'))
            .then(() => database.sync()
                .then(() => Logger.info('Done synchronizing.'))
                .catch(error => Logger.error(`Error synchronizing the database: \n${error}`))
            )
            .catch(error => {
                Logger.error(`Unable to connect to the Postgres database: \n${error}`);
                Logger.error('Attempting to reconnect to the Postgres database in 5 seconds...');
                setTimeout(() => Database.start(), 5000);
            });
    }
}

module.exports = Database;
