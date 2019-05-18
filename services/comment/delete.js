const CommentModel = require('../../db/comment.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');
const { currentUser } = require('../authenticate/request.helpers');

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

        if (await canRemove(request, commentId)) {
            try {
                await CommentModel.remove({ id: commentId });
                reply.type('application/json').code(200);
                return {};
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to delete comment: error when saving`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to delete comment: you have no rights`}
        }
    }
}

async function canRemove(request, commentId) {
    let userId = await currentUser.getId(request);
    let isAdmin = await currentUser.isAdmin(request);

    if (userId) {
        let comment = await CommentModel.findOne({ id: commentId });
        let commentAuthorId = comment._doc.authorId;

        return commentAuthorId === userId || isAdmin;
    }

    return false;
}