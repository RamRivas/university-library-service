const mongoose = require('mongoose');
const { stockMutationInLendingCart, stockIncrease} = require('./book');

const lendingCartSchema = mongoose.Schema({
    creationDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    books: {
        type: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
            },
        ],
        required: true,
        validate: [
            (val) => val.length > 0,
            'The lending cart must have minimum one book',
        ],
    },
    lendDate: Date,
    deliverDate: Date,
    delivered: {
        type: Boolean,
        default: false,
    },
});

const LendingCart = mongoose.model('LendingCart', lendingCartSchema);

const createLendingCart = async ({ creationDate, userId, books }) => {
    try {
        const lendingCart = new LendingCart({
            creationDate,
            userId,
            books,
        });

        return await lendingCart.save();
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const updateLend = async ({lendId, deliverDate, books}) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const lendingCart = await LendingCart.findById(lendId).session(session);
        const { books: prevBooks } = lendingCart;

        lendingCart.deliverDate = deliverDate;
        lendingCart.books = books;

        const result = {
            result: await lendingCart.save({session}),
            booksAffected: await stockMutationInLendingCart({books}, session, prevBooks)
        }
        await session.commitTransaction();

        return result;
    } catch (error) {
        await session.abortTransaction();
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
}

const completeLend = async ({ lendId, lendDate, deliverDate }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const lendingCart = await LendingCart.findById(lendId).exec();
        
        lendingCart.lendDate = lendDate,
        lendingCart.deliverDate = deliverDate;

        const result = {
            result: await lendingCart.save({session}),
            booksAffected: await stockMutationInLendingCart(lendingCart, session),
        }
        
        await session.commitTransaction();

        return result;
    } catch (error) {
        await session.abortTransaction();
        
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const deliverLend = async ({ lendId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const lendingCart = await LendingCart.findById(lendId).exec();

        lendingCart.delivered = true;

        const result = {
            result: await lendingCart.save({session}),
            booksAffected: await stockIncrease(lendingCart, session)
        };

        await session.commitTransaction();

        return result;
    } catch (error) {
        await session.abortTransaction();
        
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
}

module.exports = {
    lendingCartSchema,
    LendingCart,
    createLendingCart,
    completeLend,
    updateLend,
    deliverLend
};
