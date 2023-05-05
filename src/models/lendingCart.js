const mongoose = require('mongoose');
const { stockDecrease } = require('./book');

const lendingCartSchema = mongoose.Schema({
    creationDate: {
        type: Date,
        required: true
    },
    user: {
        type: Object,
        required: true,
    },
    books: {
        type: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true,
            },
            amount: {
                type: Number,
                required: true
            },
        }],
        required: true,
        validate: [(val) => val.length > 0, 'The lending cart must have minimum one book']
    },
    lendDate: Date,
    deliverDate: Date,
    delivered: {
        type: Boolean,
        default: false
    },
});

const LendingCart = mongoose.model('LendingCart', lendingCartSchema);

const createLendingCart = async ({creationDate, user, books}) => {
    try {
        const lendingCart = new LendingCart({
            creationDate,
            user,
            books
        });

        return await lendingCart.save();
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    };
};

const completeLend = async ({ lendId, lendDate, deliverDate }) => {
    try {
        const lendingCart = await LendingCart.findById(lendId).exec();
        return {
            result: await lendingCart.save({ lendDate, deliverDate }).exec(),
            booksAffected: await stockDecrease(lendingCart)
        };
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    };
};

module.exports = {
    lendingCartSchema,
    LendingCart,
    createLendingCart,
    completeLend
}