const express = require('express');
const { createRole } = require('../models/role');
const router = express.Router();

// Create user
router.post('/roles', async (req, res) => {
    try {
        const result = await createRole(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;
