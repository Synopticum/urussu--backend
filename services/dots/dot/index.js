const DotModel = require('../../../db/dot.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/dots/:dot',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: getDot
    });

    fastify.route({
        method: 'PUT',
        url: '/dots/:dot',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: updateDot
    });

    async function getDot(request, reply) {
        let dotId = request.params.dot;

        try {
            let dot = await DotModel.findOne({ id: dotId });
            if (dot) {
                reply.type('application/json').code(200);
                return dot;
            } else {
                reply.type('application/json').code(404);
                return { error: `Unable to get dot: dot ${dotId} was not found`}
            }
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get dot`}
        }
    }

    async function updateDot(request, reply) {
        let dot = request.body;

        if (dot) {
            try {
                await DotModel.findOneAndUpdate({ id: dot.id }, dot, { upsert: true });
                reply.type('application/json').code(200);
                return await DotModel.findOne({ id: dot.id });
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