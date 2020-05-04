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
        method: 'DELETE',
        url: '/:type/:id/photos/:year',
        handler: async (request, reply) => await verifyVkAuth(request, reply, remove)
    });
}

async function remove(request, reply) {
    try {
        const { type, id, year } = request.params;
        const dot = await DotModel.findOne({ id });
        const key = dot._doc.images[year];

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
    const dot = await DotModel.findOne({ id });
    delete dot._doc.images[year];

    await DotModel.findOneAndUpdate({ id }, { images: dot._doc.images });
}