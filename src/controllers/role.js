const { createRole, getAllRoles } = require('../models/role');

// Create Role
exports.postRoles = async (req, res) => {
    try {
        const result = await createRole(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
};

exports.getRoles = async (req, res) => {
    try {
        const result = await getAllRoles();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
}