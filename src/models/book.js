const mongoose = require('mongoose');
const { CTX } = require('../config');
const { Types: {ObjectId} } = mongoose;

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        validation: [(val) => val < 0, 'There are no available copies'],
    },
});

const Book = mongoose.model('Book', bookSchema);

const createBook = async ({ title, author, publishedYear, genre, stock }) => {
    try {
        const book = new Book({
            title,
            author,
            publishedYear,
            genre,
            stock,
        });

        const result = await book.save();
        return result;
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const stockDecrease = async ({ books }, session) => {
    try {
        let counter = 0;
        for (const element of books) {
            const { book, amount } = element;

            const currentBook = await Book.findById(book);
            currentBook.stock = currentBook.stock - amount;
            await currentBook.save({session});
            counter++;
        }
        return counter;
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const stockIncrease = async ({ books }, session) => {
    try {
        let counter = 0;
        for (const element of books) {
            const { book, amount } = element;

            const currentBook = await Book.findById(book);
            currentBook.stock = currentBook.stock + amount;

            await currentBook.save({session});
            counter++;
        }
        return counter;
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const stockMutationInLendingCart = async ({books}, session, prevBooks = undefined) => {
    try {
        if(!prevBooks){
            return await stockDecrease({books}, session);
        } else {
            let counter = 0;

            const intersection = books.filter(x => prevBooks.find(y => y.book.equals(x.book)));

            for (const element in intersection) {
                const { amount, book } = intersection[element];

                const currentPrevBook = prevBooks.find( ({ book: prevBook }) => prevBook.equals(book));
                const { amount: prevAmount } = currentPrevBook;

                let diff = undefined;
    
                if(amount < prevAmount){
                    diff = prevAmount - amount;
                }
                else if(amount > prevAmount){
                    diff = amount - prevAmount;
                };

                if(diff){
                    const currentBook = await Book.findById(book);
                    currentBook.stock = amount < prevAmount ? currentBook.stock + diff : currentBook.stock - diff;

                    await currentBook.save({session});
                    counter++;
                }   
            }

            const leftDiference = books.filter(x => !prevBooks.find(y => y.book.equals(x.book)));

            if(leftDiference.length > 0) counter += await stockDecrease({ books: [...leftDiference] }, session);

            const rightDiference = prevBooks.filter(x => !books.find(y => x.book.equals(y.book)));

            if(rightDiference.length > 0) counter += await stockIncrease({ books: [...rightDiference] }, session);

            return counter;
        }
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

module.exports = {
    bookSchema,
    Book,
    createBook,
    stockDecrease,
    stockMutationInLendingCart
};
