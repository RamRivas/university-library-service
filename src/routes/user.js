const express = require('express');
const { user: { createUser }, role: { Role } } = require('../models');
const router = express.Router();

// Create user
router.post("/users", async (req, res) => {
    try {
        req.body.role = Role.find({name: req.body.role});
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;