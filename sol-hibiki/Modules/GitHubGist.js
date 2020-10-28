const { GIST } = process.env;
const { error } = require('winston');
const { post } = require('snekfetch');
const { captureException } = require('raven');

module.exports = async (content) => {
    let gist;
    try {
        gist = await post('https://api.github.com/gists')
            .set('Authorization', `Token ${GIST}`).send({
                description: 'Evaluated code',
                public: false,
                files: {
                    'exec.md': {
                        content
                    }
                }
            });
    } catch (err) {
        captureException(err);
        error(err.stack);
    }

    return gist;
};