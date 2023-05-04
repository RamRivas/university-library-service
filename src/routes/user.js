const express = require('express');
const router = express.Router();
const {
    user: { createUser, login },
    role: { Role },
} = require('../models');
const { Token } = require('../models/token');
const {
    token: { authenticateAccessToken },
} = require('../middlewares');

// Create user
router.post('/users', async (req, res) => {
    try {
        req.body.role = await Role.findOne({ name: req.body.role }).exec();
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

// Logout
router.delete('/logout', authenticateAccessToken, async (req, res) => {
    try {
        const result = await Token.deleteOne({ token: req.body.token });
        if (result.deletedCount === 0) {
            res.status(400).send('This session was currently off');
        } else {
            res.status(200).send('The user was loged out successfully');
        }
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;
