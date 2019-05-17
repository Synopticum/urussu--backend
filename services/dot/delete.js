const DotModel = require('../../db/dot.model');
const CommentModel = require('../../db/comment.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'DELETE',
        url: '/dots/:dot',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });

    async function remove(request, reply) {
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