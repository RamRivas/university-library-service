const {
    user: { createUser, login },
    role: { Role },
} = require('../models');
const { Token } = require('../models/token');
const ObjectId = require('mongoose').Types.ObjectId;

// Create user
exports.postUsers = async (req, res) => {
    try {
        req.body.role = await Role.findOne({ name: req.body.role }).exec();
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};

// Login
exports.postLogin = async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};

// Logout
exports.deleteLogout = async (req, res) => {
    try {
        const { token } = req.body;
        const { user: { _id } } = req;
        const result = await Token.deleteOne({ token: token, userId: new ObjectId(_id) });
        if (result.deletedCount === 0) {
            res.status(400).send('This session was currently off');
        } else {
            res.status(200).send('The user was logged out successfully');
        }
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};