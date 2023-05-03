const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const { PORT, CTX, SALT_ROUNDS, URI } = process.env;

const config = {
    PORT,
    CTX,
    SALT_ROUNDS,
    URI,
};

for (const element in config)
    assert(config[element], `${element} missing on .env file`);

module.exports = config;
