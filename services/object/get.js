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

    async function get(request, reply) {
        let objectId = request.params.object;

        try {
            let object = await ObjectModel.findOne({ id: objectId }).select({ '_id': 0, '__v': 0});
            if (object) {
                reply.type('application/json').code(200);
                return object;
            } else {
                reply.type('application/json').code(404);
                return { error: `Unable to get object: object ${objectId} was not found`}
            }
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get object: error when finding in db`}
        }
    }
}