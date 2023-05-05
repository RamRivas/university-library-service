const mongoose = require('mongoose');

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
        validation: [(val) => val < 0, 'There are no available copies']
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

const stockDecrease = async ({books}) => {
    try {
        let counter = 0;
        for(const element in books){
            const currentBook = await Book.updateOne({ _id: element.book._id },{ stock: stock - element.amount }).exec();
            if(currentBook.ok === 1) counter ++;
        };
        return counter;
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
}

module.exports = {
    bookSchema,
    Book,
    createBook,
    stockDecrease
};
