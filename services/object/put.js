const mongoose = require('mongoose');
const ObjectModel = require('../../db/object.model');
const PathModel = require('../../db/path.model');
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

    fastify.route({
        method: 'PUT',
        url: '/paths/:path',
        handler: async (request, reply) => await verifyVkAuth(request, reply, put)
    });

    async function put(request, reply) {
        let model = request.body;
        const Model = model.instanceType === 'object' ? ObjectModel : PathModel;

        if (await canPut(request, model)) {
            if (model) {
                try {
                    await Model.findOneAndUpdate({ id: { '$regex': model.id, '$options': 'i' } }, model, { upsert: true });
                    reply.type('application/json').code(200);
                    return await Model.findOne({ id: { '$regex': model.id, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
                } catch (e) {
                    reply.type('application/json').code(500);
                    console.error(e);
                    return { error: `Unable to update ${model.instanceType}: error when saving`}
                }
            } else {
                reply.type('application/json').code(400);
                return { error: `Unable to update ${model.instanceType}: model was not provided`}
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update ${model.instanceType}: you have no rights`}
        }
    }
}

async function canPut(request) {
    let isAnonymous = await currentUser.isAnonymous(request);
    return !isAnonymous;
}