const UserModel = require('../../db/user.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/user',
        handler: getMyUser
    });
}

async function getMyUser(request, reply) {
    let token = request.headers['token'];
    let user = await UserModel.findOne({ token }).select({ '_id': 0, '__v': 0 });

    if (!user) {
        reply.type('application/json').code(404);
        return { error: 'User not found'};
    }

    if (user && user.tokenExpiresIn - Date.now() > 0) {
        reply.type('application/json').code(200);
        return prepareResponse(user);
    }

    reply.type('application/json').code(401);
    return { error: `Token ${token} is invalid or expired` };
}

function prepareResponse(user) {
    user.token = undefined;
    user.tokenExpiresIn = undefined;
    return user;
}