const UserModel = require('../../db/user.model');

async function get(request) {
    let token = request.headers['token'];
    let user = await UserModel.findOne({ token });

    if (user) {
        return user;
    }

    throw new Error('No user found');
}

async function getId(request) {
    let token = request.headers['token'];
    let user = await UserModel.findOne({ token });

    if (user) {
        return user._doc.id;
    }

    throw new Error('No user found');
}

async function isAdmin(request) {
    let token = request.headers['token'];
    let user = await UserModel.findOne({ token });

    return user && user._doc.role === 'admin';
}

module.exports = {
    currentUser: {
        get,
        getId,
        isAdmin
    }
};