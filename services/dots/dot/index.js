const DotModel = require('../../../db/dot.model');
const CommentModel = require('../../../db/comment.model');
const verifyVkAuth = require('../../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/dots/:dot',
        handler: getDot
    });

    fastify.route({
        method: 'PUT',
        url: '/dots/:dot',
        handler: async (request, reply) => await verifyVkAuth(request, reply, updateDot)
    });


    fastify.route({
        method: 'DELETE',
        url: '/dots/:dot',
        handler: async (request, reply) => await verifyVkAuth(request, reply, deleteDot)
    });

    async function getDot(request, reply) {
        let dotId = request.params.dot;

        try {
            let dot = await DotModel.findOne({ id: dotId }).select({ '_id': 0, '__v': 0});
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

    async function deleteDot(request, reply) {
        let dotId = request.params.dot;

        try {
            await DotModel.remove({ id: dotId });
            await CommentModel.remove({ originId: dotId });
            reply.type('application/json').code(200);
            return {};
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to delete a dot: error when deleting`}
        }
    }
}