const DotModel = require('../../db/dot.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'PUT',
        url: '/dots/:dot',
        handler: async (request, reply) => await verifyVkAuth(request, reply, put)
    });

    async function put(request, reply) {
        let dot = request.body;

        if (dot) {
            try {
                await DotModel.findOneAndUpdate({ id: dot.id }, dot, { upsert: true });
                reply.type('application/json').code(200);
                return await DotModel.findOne({ id: dot.id }).select({ '_id': 0, '__v': 0});
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to update dot: error when saving`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update dot: dot model hasn't been provided`}
        }
    }
}