const { s3 } = require('../../config/aws');
const uuidv4 = require('uuid/v4');
const DotModel = require('../../db/dot.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(() => registerRoutes(fastify, opts));
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'POST',
        url: '/:type/:id/photos',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });
}

async function remove(request, reply) {
    try {
        const { type, id } = request.params;
        const key = request.body;

        await removePhotoFromS3(key);
        await removePhotoFromModel(type, id, key);

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

async function removePhotoFromModel(type, id, key) {
    let dot = await DotModel.findOne({ id });
    let images = dot._doc.images;

    await DotModel.findOneAndUpdate({ id }, { images: images ? images.filter(imageKey => imageKey !== key) : images});
}