const CommentModel = require('../../db/comment.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/:type/:id/comments',
        handler: get
    });

    async function get(request, reply) {
        let originId = request.params.id;

        try {
            reply.type('application/json').code(200);
            return await CommentModel.find({ originId }).select({ '_id': 0, '__v': 0});
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get comments: error when finding in db`}
        }
    }
}