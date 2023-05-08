const express = require('express');
const { token: {authenticateAccessToken} } = require('../middlewares');
const { role: { postRoles } } = require('../controllers');
const router = express.Router();

// Create role
router.post('/roles', authenticateAccessToken, postRoles);

module.exports = router;
