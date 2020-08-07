const CommentModel = require('../../db/comment.model');
const helpers = require('../helpers');
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

    fastify.route({
        method: 'DELETE',
        url: '/paths/:path',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });

    async function remove(request, reply) {
        const type = helpers.getType(request.params);
        const id = request.params[type];
        const Model = helpers.getModel(type);

        if (await canRemove(request, id, Model)) {
            try {
                await removePhotos(request, reply, id, Model);
                await removeModel(request, reply, id, Model);
                await removeComments(request, reply, id);

                reply.type('application/json').code(200);
                return {};
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to delete an object or path: unknown error when deleting`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to remove an object or path: you have no rights`}
        }
    }
}

async function canRemove(request, id, Model) {
    let userId = await currentUser.getId(request);
    let isAdmin = await currentUser.isAdmin(request);

    if (userId) {
        let model = await Model.findOne({ id: { '$regex': id, '$options': 'i' } });
        let modelAuthorId;

        if (model._doc) {
            modelAuthorId = model._doc.authorId;
        }

        return modelAuthorId === userId || isAdmin;
    }

    return false;
}

async function removeModel(request, reply, id, Model) {
    try {
        await Model.deleteOne({ id: { '$regex': id, '$options': 'i' } });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove an object: error when deleting the object model`}
    }
}

async function removeComments(request, reply, id) {
    try {
        await CommentModel.deleteOne({ originId: { '$regex': id, '$options': 'i' } });
    } catch (e) {
        reply.type('application/json').code(500);
        return { error: `Unable to remove an object: error when deleting the object comments`}
    }
}

async function removePhotos(request, reply, id, Model) {
    const query = { id: { '$regex': id, '$options': 'i' } };
    const model = await Model.findOne(query);
    const images = model._doc.images;

    if (images) {
        const keys = Object.keys(images).map(year => ({ Key: images[year] }));
        await helpers.removePhotosFromS3(keys);
    }
}
