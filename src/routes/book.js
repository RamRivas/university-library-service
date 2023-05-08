const express = require('express');
const {
    token: { authenticateAccessToken },
} = require('../middlewares');
const { book: {postBooks} } = require('../controllers');
const router = express.Router();

// Create book
router.post('/books', authenticateAccessToken, postBooks);

module.exports = router;
