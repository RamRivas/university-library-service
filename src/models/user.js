const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, CTX } = require('../config');
const { signUser, Token } = require('./token');
const { Role } = require('./role');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
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
            role: role._id,
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
        const { _id, pwd: pwdInDb, role } = user;

        const correctPwd = await bcrypt.compare(pwd, pwdInDb);
        if (!correctPwd) {
            return {
                message: 'Incorrect Password',
                icon: 'error'
            };
        }

        const activeSessions = await Token.find({ userId: _id }).exec();

        if (activeSessions.length > 0)
            return {
                message: 'This user already has an open session',
                icon: 'warning'
            };

        return {
            result: 'You are now logged in',
            tokens: await signUser(user),
            role: await Role.findById(role)
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

const logoutNoAuth = async ({email, pwd}) => {
    try {
        // console.log(email);
        const user = await User.findOne({ email }).exec();
        if(!user) return {
            text: 'User not found',
            icon: 'warning'
        };

        const { _id, pwd: pwdInDb } = user;

        const correctPwd = await bcrypt.compare(pwd, pwdInDb);

        if (!correctPwd) {
            return {
                text: 'Incorrect Password',
                icon: 'error'
            };
        }

        const result = await Token.deleteOne({ userId: _id });

        if(result.deletedCount === 0) return {
            text: 'This session was currently off',
            icon: 'warning'
        };

        return {
            text: 'The user was logged out successfully, try login again',
            icon: 'success'
        };
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(
            `${error.message}. ${
                CTX === 'dev' ? `Path ${__dirname}${__filename}` : ``
            }`
        );
    }
}

module.exports = {
    User,
    userSchema,
    createUser,
    login,
    logoutNoAuth
};
