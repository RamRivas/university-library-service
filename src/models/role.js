const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Student', 'Librarian'],
    },
});

const Role = mongoose.model('Role', roleSchema);

const createRole = async ({ name }) => {
    try {
        const role = new Role({
            name,
        });

        const result = await role.save();
        return result;
    } catch (error) {
        throw new Error(`Error ${error.message}. Path ${__filename}`);
    }
};

module.exports = {
    Role,
    roleSchema,
    createRole,
};
