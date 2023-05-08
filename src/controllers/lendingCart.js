const { lendingCart: { createLendingCart, completeLend, updateLend } } = require('../models');

const lendingCartUpdateCommands = [
    async body => {
        return await completeLend(body);
    }, //0 Complete lend
    async body => {
        return await updateLend(body);
    }, //1 Change books ammounts
];

// Create LendingCart
exports.postLendingCarts = async (req, res) => {
    try {
        const result = await createLendingCart(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    };
};

// Update LendingCart
exports.putLendingCarts = async (req, res) => {
    try {
        const { command } = req.body;
        const result = await lendingCartUpdateCommands[command](req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    };
};