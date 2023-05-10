const express = require('express');
const router = express.Router();
const {
    token: { authenticateAccessToken },
} = require('../middlewares');
const { user: { deleteLogout, postLogin, postUsers } } = require('../controllers');
const { deleteLogoutNoAuth } = require('../controllers/user');

// Create user
router.post('/users', authenticateAccessToken, postUsers);

// Login
router.post('/login', postLogin);

// Logout
router.delete('/logout', authenticateAccessToken, deleteLogout);

// Logout no auth
router.delete('/logoutNoAuth', deleteLogoutNoAuth);

module.exports = router;
