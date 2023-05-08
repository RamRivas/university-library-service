const express = require('express');
const { token: { postToken } } = require('../controllers');
const router = express.Router();

// Get new access token
router.post('/token', postToken);

module.exports = router;
