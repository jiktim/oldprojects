const Currency = require('./Currency');
const Redis = require('./Redis');

const HOUR_DURATION = 3.6e+6;

module.exports = class Hourly {
    static get hourlyPayout() {
        return 100;
    }

    static get hourlyDonationPayout() {
        return 190;
    }

    static async received(userID) {
        const lastHourly = await Redis.db.getAsync(`hourly${userID}`);
        if (!lastHourly) return false;

        return Date.now() - HOUR_DURATION < lastHourly;
    }

    static async nextHourly(userID) {
        const lastHourly = await Redis.db.getAsync(`hourly${userID}`);

        return HOUR_DURATION - (Date.now() - lastHourly);
    }

    static async receive(userID, donationID) {
        if (donationID) Currency._changeBalance(donationID, Hourly.hourlyDonationPayout);
        else Currency._changeBalance(userID, Hourly.hourlyPayout);
        await Redis.db.setAsync(`hourly${userID}`, Date.now());
        await Redis.db.expireAsync(`hourly${userID}`, HOUR_DURATION / 1000);
    }
};
