const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    role: {
        type: Object,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

const createUser = async ({ name, pwd, role }) => {
    try {
        const user = new User({
            name,
            pwd: await bcrypt.hash(pwd, parseInt(SALT_ROUNDS)),
            role,
        });

        const result = await user.save();
        return result;
    } catch (error) {
        throw new Error(
            `Error ${error.message}. Path ${__dirname}${__filename}`
        );
    }
};

const login = async ({ name, pwd }) => {
    try {
        const user = await User.findOne({ name }).exec();
        if (!user) {
            return 'User not found';
        }

        const correctPwd = await bcrypt.compare(pwd, user.pwd);
        if(!correctPwd) {
            return 'Incorrect Password';
        };

        return 'You are now logged in';
    } catch (error) {
        throw new Error(
            `Error ${error.message}. Path ${__dirname}${__filename}`
        );
    }
};

module.exports = {
    User,
    userSchema,
    createUser,
    login
};
