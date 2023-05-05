const express = require('express');
const {
    token: { authenticateAccessToken },
} = require('../middlewares');
const {
    book: { createBook },
} = require('../models');
const router = express.Router();

// Create book
router.post('/books', authenticateAccessToken, async (req, res) => {
    try {
        const result = await createBook(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

module.exports = router;
