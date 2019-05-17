const CommentModel = require('../../db/comment.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'DELETE',
        url: '/:type/:id/comments/:commentId',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });

    async function remove(request, reply) {
        let commentId = request.params.commentId;

        try {
            await CommentModel.remove({ id: commentId });
            reply.type('application/json').code(200);
            return {};
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to delete comment: error when saving`}
        }
    }
}