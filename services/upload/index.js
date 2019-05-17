const { s3 } = require('../../config/aws');
const uuidv4 = require('uuid/v4');
const DotModel = require('../../db/dot.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(() => registerRoutes(fastify, opts));
};

async function registerRoutes(fastify, opts) {
    const upload = opts.multer({
        storage: opts.multer.memoryStorage()
    });

    fastify.route({
        method: 'PUT',
        url: '/:type/:id/photos',
        preHandler: [upload.single('photo')],
        handler: async (request, reply) => await verifyVkAuth(request, reply, uploadPhoto)
    });

    fastify.route({
        method: 'POST',
        url: '/:type/:id/photos',
        handler: async (request, reply) => await verifyVkAuth(request, reply, deletePhoto)
    });
}

async function uploadPhoto(request, reply) {
    try {
        const { type, id } = request.params;
        const extension = request.file.originalname.split('.').pop().toLowerCase();
        const name = `${uuidv4()}.${extension}`;

        const file = request.file.buffer;
        const key = `photos/${type}s/${id}/${name}`;

        await _uploadPhotoToS3(file, key);
        await _addPhotoToModel(type, id, key);

        reply.code(200).send({ key });
    } catch (e) {
        reply.code(400).send({ error: e.message });
    }
}

async function deletePhoto(request, reply) {
    try {
        const { type, id } = request.params;
        const key = request.body;

        await _deletePhotoFromS3(key);
        await _removePhotoFromModel(type, id, key);

        reply.code(200).send({ key });
    } catch (e) {
        reply.code(400).send({ error: e.message });
    }
}

async function _uploadPhotoToS3(photo, key) {
    return new Promise((resolve, reject) => {
        s3.upload({
            Key: key,
            Body: photo,
            ACL: 'public-read'
        }, (err, data) => {
            if (err) {
                console.error('There was an error uploading your photo: ', err.message);
                reject(err.message);
            }

            resolve(data);
        });
    });
}

async function _deletePhotoFromS3(key) {
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

async function _addPhotoToModel(type, id, key) {
    let dot = await DotModel.findOne({ id });
    let images = dot._doc.images;

    await DotModel.findOneAndUpdate({ id }, { images: images ? [...images, key] : [key]});
}

async function _removePhotoFromModel(type, id, key) {
    let dot = await DotModel.findOne({ id });
    let images = dot._doc.images;

    await DotModel.findOneAndUpdate({ id }, { images: images ? images.filter(imageKey => imageKey !== key) : images});
}