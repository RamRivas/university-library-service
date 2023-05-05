const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, CTX } = require('../config');
const { signUser, Token } = require('./token');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    role: {
        type: Object,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

const createUser = async ({ firstName, lastName, email, pwd, role }) => {
    try {
        const user = new User({
            firstName,
            lastName,
            email,
            pwd: await bcrypt.hash(pwd, parseInt(SALT_ROUNDS)),
            role,
        });

        const result = await user.save();
        return result;
    } catch (error) {
        throw new Error(`${error.message}. Path ${__dirname}${__filename}`);
    }
};

const login = async ({ email, pwd }) => {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return 'User not found';
        }

        const correctPwd = await bcrypt.compare(pwd, user.pwd);
        if (!correctPwd) {
            return 'Incorrect Password';
        }

        const activeSessions = await Token.find({ user: user }).exec();

        if (activeSessions.length > 0)
            return 'This user already has an open session';

        return {
            result: 'You are now logged in',
            tokens: await signUser(user),
        };
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(
            `${error.message}. ${
                CTX === 'dev' ? `Path ${__dirname}${__filename}` : ``
            }`
        );
    }
};

module.exports = {
    User,
    userSchema,
    createUser,
    login,
};
