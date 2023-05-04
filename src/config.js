const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const { PORT, CTX, SALT_ROUNDS, URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const config = {
    PORT,
    CTX,
    SALT_ROUNDS,
    URI,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};

for (const element in config)
    assert(config[element], `${element} missing on .env file`);

module.exports = config;
