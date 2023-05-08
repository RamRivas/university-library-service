const express = require('express');
const router = express.Router();
const {token: {authenticateAccessToken}} = require('../middlewares');
const { lendingCart: { postLendingCarts, putLendingCarts } } = require('../controllers');

// Create LendingCart
router.post('/lendingcarts', authenticateAccessToken, postLendingCarts);

// Update Lend
router.put('/lendingCarts', authenticateAccessToken, putLendingCarts);

module.exports = router;