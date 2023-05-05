const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, CTX } = require('../config');
const { signUser, Token } = require('./token');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
});

const User = mongoose.model('User', userSchema);

const createUser = async ({ name, pwd, role }) => {
    try {
        const user = new User({
            name,
            pwd: await bcrypt.hash(pwd, parseInt(SALT_ROUNDS)),
            role: role._id,
        });

        const result = await user.save();
        return result;
    } catch (error) {
        throw new Error(
            `${error.message}. Path ${__dirname}${__filename}`
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

        const activeSessions = await Token.find({ user: user }).exec();
        
        if(activeSessions.length > 0) return 'This user already has an open session';

        return {
            result: 'You are now logged in',
            tokens: await signUser(user)
        };
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(
            `${error.message}. ${ CTX === 'dev' ? `Path ${__dirname}${__filename}` : ``}`
        );
    }
};

module.exports = {
    User,
    userSchema,
    createUser,
    login
};
