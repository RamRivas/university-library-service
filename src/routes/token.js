const express = require('express');
const router = express.Router();
const {
    token: { Token, generateAccessToken },
} = require('../models');
const {
    token: { verifyToken },
} = require('../services');
const { REFRESH_TOKEN_SECRET } = require('../config');

// Get new access token
router.post('/token', async (req, res) => {
    try {
        const refreshToken = req.body.token;
        if (!refreshToken) return res.sendStatus(401);
        if (!Token.findOne({ token: refreshToken }).exec())
            return res.sendStatus(403);
        verifyToken(refreshToken, REFRESH_TOKEN_SECRET, req, res, async () => {
            const accessToken = await generateAccessToken(req.user);
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;
