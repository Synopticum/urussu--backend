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
        if (request.query && request.query.coordinates) {
            reply.type('application/json').code(200);
            const coordinates = JSON.parse(request.query.coordinates);
            const object = await getObjectByCoordinates(coordinates);
            return object;
        }
    }

    async function getObjectByCoordinates(coordinates) {
        const object = await ObjectModel.findOne({coordinates});
        return object;
    }

}