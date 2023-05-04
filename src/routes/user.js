const express = require('express');
const {
    user: { createUser },
    role: { Role },
} = require('../models');
const router = express.Router();

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
router.post("/login", async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;
