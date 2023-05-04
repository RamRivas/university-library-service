const jwt = require('jsonwebtoken');

const verifyToken = (token, secret, req, res, next) => {
    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = {
    verifyToken,
};
