const {
    token: { Token, generateAccessToken },
} = require('../models');
const {
    token: { verifyToken },
} = require('../services');
const { REFRESH_TOKEN_SECRET } = require('../config');

// Ger new Access Token
exports.postToken = async (req, res) => {
    try {
        const refreshToken = req.body.token;
        if (!refreshToken) return res.sendStatus(401);
        if (!await Token.findOne({ token: refreshToken }).exec())
            return res.sendStatus(403);
        verifyToken(refreshToken, REFRESH_TOKEN_SECRET, req, res, async () => {
            const accessToken = await generateAccessToken(req.user);
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};