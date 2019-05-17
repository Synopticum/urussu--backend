const mongoose = require('mongoose');
const ObjectModel = require('../../db/object.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'PUT',
        url: '/objects/:object',
        handler: async (request, reply) => await verifyVkAuth(request, reply, put)
    });

    async function put(request, reply) {
        let object = request.body;
        let objectId = request.params.object;

        if (object) {
            try {
                await ObjectModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(objectId) }, object, { upsert: true });
                reply.type('application/json').code(200);
                return await ObjectModel.findOne({ _id: mongoose.Types.ObjectId(objectId) });
            } catch (e) {
                reply.type('application/json').code(500);
                console.error(e);
                return { error: `Unable to update object: error when saving`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update object: object model hasn't been provided`}
        }
    }
}