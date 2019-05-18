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

    return user._doc && user._doc.role === 'admin';
}

async function isAnonymous(request) {
    let token = request.headers['token'];
    let user = await UserModel.findOne({ token });

    return !token || !user._doc || user._doc.role === 'anonymous';
}

module.exports = {
    currentUser: {
        get,
        getId,
        isAdmin,
        isAnonymous
    }
};