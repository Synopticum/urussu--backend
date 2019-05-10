const CommentModel = require('../../../db/comment.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'PUT',
        url: '/:type/:id/comments/:commentId',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: putComment
    });

    fastify.route({
        method: 'DELETE',
        url: '/:type/:id/comments/:commentId',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: deleteComment
    });

    async function putComment(request, reply) {
        let comment = request.body;

        if (comment) {
            try {
                await CommentModel.findOneAndUpdate({ id: comment.id }, comment, { upsert: true });
                reply.type('application/json').code(200);
                return await CommentModel.findOne({ id: comment.id }).select({ '_id': 0, '__v': 0});
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to update comment: error when saving`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update comment: comment model hasn't been provided`}
        }
    }

    async function deleteComment(request, reply) {
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