const {
    book: { createBook },
} = require('../models');

// Create Book
exports.postBooks = async (req, res) => {
    try {
        const result = await createBook(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};