const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CTX } = require('../config');
const {
    token: { verifyToken },
} = require('../services');

const authenticateAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);

        verifyToken(token, ACCESS_TOKEN_SECRET, req, res, next);
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(
            `Error ${error.message}. ${
                CTX === 'dev' ? `Path ${__dirname}${__filename}` : ``
            }`
        );
    }
};

module.exports = {
    authenticateAccessToken,
};
