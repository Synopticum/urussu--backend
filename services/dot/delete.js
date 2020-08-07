const DotModel = require('../../db/dot.model');
const CommentModel = require('../../db/comment.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');
const { currentUser } = require('../authenticate/request.helpers');
const helpers = require('../helpers');

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

        if (await canRemove(request, dotId)) {
            try {
                await removePhotos(request, reply, dotId);
                await removeModel(request, reply, dotId);
                await removeComments(request, reply, dotId);

                reply.type('application/json').code(200);
                return {};
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to delete a dot: unknown error when deleting`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to remove a dot: you have no rights`}
        }
    }
}

async function canRemove(request, dotId) {
    let userId = await currentUser.getId(request);
    let isAdmin = await currentUser.isAdmin(request);

    if (userId) {
        let dotModel = await DotModel.findOne({ id: { '$regex': dotId, '$options': 'i' } });
        let dotAuthorId;

        if (dotModel._doc) {
            dotAuthorId = dotModel._doc.authorId;
        }

        return dotAuthorId === userId || isAdmin;
    }

    return false;
}

async function removePhotos(request, reply, dotId) {
    try {
        const dot = await DotModel.findOne({ id: { '$regex': dotId, '$options': 'i' } });
        const images = dot._doc.images;

        if (images) {
            let keys = Object.values(images).map(image => ({ Key: image }));
            await helpers.removePhotosFromS3(keys);
        }
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove a dot: error when deleting dot photos`}
    }
}

async function removeModel(request, reply, dotId) {
    try {
        await DotModel.deleteOne({ id: { '$regex': dotId, '$options': 'i' } });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove a dot: error when deleting a dot model`}
    }
}

async function removeComments(request, reply, dotId) {
    try {
        await CommentModel.deleteOne({ originId: { '$regex': dotId, '$options': 'i' } });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove a dot: error when deleting dot comments`}
    }
}