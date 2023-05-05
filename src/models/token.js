const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CTX } = require('../config');

const tokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Token = mongoose.model('Token', tokenSchema);

const signUser = async (user) => {
    try {
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        const token = new Token({
            token: refreshToken,
            userId: user._id,
        });

        await token.save();
        return {
            accessToken,
            refreshToken,
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

const generateAccessToken = async (user) => {
    try {
        return jwt.sign({ user }, ACCESS_TOKEN_SECRET, { expiresIn: '60d' });
    } catch (error) {
        CTX === 'dev' && console.log(error);
        throw new Error(
            `${error.message}. ${
                CTX === 'dev' ? `Path ${__dirname}${__filename}` : ``
            }`
        );
    }
};

const generateRefreshToken = async (user) => {
    try {
        return jwt.sign({ user }, REFRESH_TOKEN_SECRET);
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
    tokenSchema,
    Token,
    signUser,
    generateAccessToken,
};
