const ObjectModel = require('../../db/object.model');
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
        url: '/objects/:object',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });

    async function remove(request, reply) {
        let objectId = request.params.object;

        if (await canRemove(request, objectId)) {
            try {
                await removeModel(request, reply, objectId);
                await removeComments(request, reply, objectId);

                reply.type('application/json').code(200);
                return {};
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to delete an object: unknown error when deleting`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to remove an object: you have no rights`}
        }
    }
}

async function canRemove(request, objectId) {
    let userId = await currentUser.getId(request);
    let isAdmin = await currentUser.isAdmin(request);

    if (userId) {
        let objectModel = await ObjectModel.findOne({ id: objectId });
        let objectAuthorId;

        if (objectModel._doc) {
            objectAuthorId = objectModel._doc.authorId;
        }

        return objectAuthorId === userId || isAdmin;
    }

    return false;
}

async function removeModel(request, reply, objectId) {
    try {
        await ObjectModel.remove({ id: objectId });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove an object: error when deleting the object model`}
    }
}

async function removeComments(request, reply, objectId) {
    try {
        await CommentModel.remove({ originId: objectId });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove an object: error when deleting the object comments`}
    }
}