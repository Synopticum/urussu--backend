const UserModel = require('../../db/user.model');

module.exports = async function verifyVkAuth(request, reply, done) {
    let token = request.headers['token'];

    if (token) {
        let user = await UserModel.findOne({ token });

        if (user && user.tokenExpiresIn - Date.now() > 0) {
            return done();
        }

        return done(new Error('Token is invalid or expired'));
    }

    return done(new Error('No token provided'));
};