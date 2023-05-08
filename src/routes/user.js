const express = require('express');
const router = express.Router();
const {
    token: { authenticateAccessToken },
} = require('../middlewares');
const { user: { deleteLogout, postLogin, postUsers } } = require('../controllers');

// Create user
router.post('/users', authenticateAccessToken, postUsers);

// Login
router.post('/login', postLogin);

// Logout
router.delete('/logout', authenticateAccessToken, deleteLogout);

module.exports = router;
