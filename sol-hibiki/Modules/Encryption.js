const { ENCRYPT_KEY } = process.env;
const { createCipher, createDecipher } = require('crypto');

module.exports = class Encryption {
    constructor (client) {
        this.client = client;
    }

    encrypt (str) {
        let cipher = createCipher('aes256', ENCRYPT_KEY);
        let encrypted = cipher.update(str, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt (str) {
        let decipher = createDecipher('aes256', ENCRYPT_KEY);
        let decrypted = decipher.update(str, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
