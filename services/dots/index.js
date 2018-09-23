const DotModel = require('../../db/dot.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/dots',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: getDots
    });

    async function getDots(request, reply) {
        try {
            reply.type('application/json').code(200);
            return await DotModel.find().select({ '_id': 0, '__v': 0});
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get dots: error when finding in db`}
        }
    }
}