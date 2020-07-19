const PathModel = require('../../db/path.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/paths',
        handler: get
    });

    async function get(request, reply) {
        try {
            reply.type('application/json').code(200);
            return await PathModel.find();
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get paths: error when finding in db`}
        }
    }
}