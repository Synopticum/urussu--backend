const ObjectModel = require('../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/objects/:object',
        handler: get
    });

    fastify.route({
        method: 'GET',
        url: '/paths/:path',
        handler: get
    });

    async function get(request, reply) {
        let id = request.params.object || request.params.path;

        try {
            let object = await ObjectModel.findOne({ id: { '$regex': id, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
            if (object) {
                reply.type('application/json').code(200);
                return object;
            } else {
                reply.type('application/json').code(404);
                return { error: `Unable to get object or path: object ${id} was not found`}
            }
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get object or path: error when finding in db`}
        }
    }
}