const express = require('express');
const { token: {authenticateAccessToken} } = require('../middlewares');
const { role: { postRoles } } = require('../controllers');
const { getRoles } = require('../controllers/role');
const router = express.Router();

// Create role
router.post('/roles', authenticateAccessToken, postRoles);

// Get Roles
router.get('/roles', authenticateAccessToken, getRoles);

module.exports = router;
