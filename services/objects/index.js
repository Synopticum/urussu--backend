const ObjectModel = require('../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/objects',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: getObjects
    });

    async function getObjects(request, reply) {
        if (request.query && request.query.include.includes('paths')) {
            reply.type('application/json').code(200);
            const objects = await ObjectModel.find({ type: 'path' });
            return objects;
        }

        if (request.query && request.query.include.includes('circles')) {
            reply.type('application/json').code(200);
            const objects = await ObjectModel.find({ type: 'circle' });
            return objects;
        }

        reply.type('application/json').code(200);
        const objects = await ObjectModel.find();
        return objects;
    }
}