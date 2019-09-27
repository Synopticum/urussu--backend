const mongoose = require('mongoose');
const ObjectModel = require('../../db/object.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');
const { currentUser } = require('../authenticate/request.helpers');

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

        if (await canPut(request, object)) {
            if (object) {
                try {
                    await ObjectModel.findOneAndUpdate({ id: object.id }, object, { upsert: true });
                    reply.type('application/json').code(200);
                    return await ObjectModel.findOne({ id: object.id }).select({ '_id': 0, '__v': 0});
                } catch (e) {
                    reply.type('application/json').code(500);
                    console.error(e);
                    return { error: `Unable to update object: error when saving`}
                }
            } else {
                reply.type('application/json').code(400);
                return { error: `Unable to update object: object model hasn't been provided`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update object: you have no rights`}
        }
    }
}

async function canPut(request) {
    let isAnonymous = await currentUser.isAnonymous(request);
    return !isAnonymous;
}