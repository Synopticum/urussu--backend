const { s3 } = require('../../config/aws');

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
        url: '/upload',
        beforeHandler: [
            upload.single('photo'),
            fastify.auth([fastify.verifyVkAuth]),
        ],
        handler: async function (request, reply) {
            // request.file is the `avatar` file
            // request.body will hold the text fields, if there were any
            try {
                const photo = request.file.buffer;
                const key = request.body.key;

                await _uploadPhoto(photo, key);
                reply.code(200).send('SUCCESS');
            } catch (e) {
                reply.code(400).send('FAILURE');
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