const UserModel = require('../../db/user.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/checkToken',
        handler: async function checkToken(request, reply) {
            let token = request.query.token;
            let user = await UserModel.findOne({ token });

            if (user && user.tokenExpiresIn - Date.now() > 0) {
                reply.type('application/json').code(200);
                return true;
            }

            reply.type('application/json').code(401);
            return { error: `Token ${token} is invalid or expired` };
        }
    });
}