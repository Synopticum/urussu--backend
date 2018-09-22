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
        reply.type('application/json').code(200);
        const dots = await DotModel.find();
        return dots;
    }
}