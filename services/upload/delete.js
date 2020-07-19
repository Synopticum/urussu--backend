const { s3 } = require('../../config/aws');
const verifyVkAuth = require('../authenticate/verifyVkAuth');
const helpers = require('./helpers');

module.exports = async function (fastify, opts) {
    fastify
        .register(() => registerRoutes(fastify, opts));
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'DELETE',
        url: '/:type/:id/photos/:year',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });
}

async function remove(request, reply) {
    try {
        const { type, id, year } = request.params;
        const query = { id: { '$regex': id, '$options': 'i' } };
        const Model = helpers.getModel(type);
        const model = await Model.findOne(query);
        const key = model._doc.images[year];

        await removePhotoFromS3(key);
        await removePhotoFromModel(type, id, year);

        reply.code(200).send({ key });
    } catch (e) {
        reply.code(400).send({ error: e.message });
    }
}

async function removePhotoFromS3(key) {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Key: key
        }, (err, data) => {
            if (err) {
                console.error('There was an error deleting your photo: ', err.message);
                reject(err.message);
            }

            resolve(data);
        });
    });
}

async function removePhotoFromModel(type, id, year) {
    const query = { id: { '$regex': id, '$options': 'i' } };
    const Model = helpers.getModel(type);
    const model = await Model.findOne(query);
    delete model._doc.images[year];

    await Model.findOneAndUpdate(query, { images: model._doc.images });
}