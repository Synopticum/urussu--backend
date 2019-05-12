const { s3 } = require('../../config/aws');
const uuidv4 = require('uuid/v4');
const DotModel = require('../../db/dot.model');

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
        preHandler: [
            upload.single('photo'),
            fastify.auth([fastify.verifyVkAuth])
        ],
        handler: async function (request, reply) {
            try {
                const { type, id } = request.params;
                const extension = request.file.originalname.split('.').pop().toLowerCase();
                const name = `${uuidv4()}.${extension}`;

                const file = request.file.buffer;
                const key = `photos/${type}s/${id}/${name}`;

                await _uploadPhoto(file, key);
                // await DotModel.findByIdAndUpdate();
                reply.code(200).send({ key });
            } catch (e) {
                reply.code(400).send({ error: e.message });
            }
        }
    });
}

const _uploadPhoto = async (photo, key) => {
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
};