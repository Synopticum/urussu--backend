const ObjectModel = require('../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/objects',
        handler: get
    });

    async function get(request, reply) {
        if (request.query && request.query.include.includes('paths')) {
            try {
                reply.type('application/json').code(200);
                return await ObjectModel.find({ type: 'path' });
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to get paths: error when finding in db`}
            }
        }

        if (request.query && request.query.include.includes('circles')) {
            try {
                reply.type('application/json').code(200);
                return await ObjectModel.find({ type: 'circle' });
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to get circles: error when finding in db`}
            }
        }

        try {
            reply.type('application/json').code(200);
            return await ObjectModel.find();
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get objects: error when finding in db`}
        }
    }
}