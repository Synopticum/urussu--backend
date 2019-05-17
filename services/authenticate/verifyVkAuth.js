const UserModel = require('../../db/user.model');

module.exports = async function verifyVkAuth(request, reply, callback) {
    let token = request.headers['token'];

    if (token) {
        let user = await UserModel.findOne({ token });

        if (user && user.tokenExpiresIn - Date.now() > 0) {
            return callback(request, reply);
        }

        reply.code(400).send({ error: 'Token is invalid or expired' });
    }

    reply.code(400).send({ error: 'No token provided' });
};