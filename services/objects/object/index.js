const mongoose = require('mongoose');
const ObjectModel = require('../../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'PUT',
        url: '/objects/:object',
        beforeHandler: fastify.auth([fastify.verifyVkAuth]),
        handler: updateObject
    });

    async function updateObject(request, reply) {
        let object = request.body;

        if (object) {
            if (object.id === request.params.object) {
                try {
                    await ObjectModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(object.id) }, object, { upsert: true });
                    reply.type('application/json').code(200);
                    return await ObjectModel.findOne({ _id: mongoose.Types.ObjectId(object.id) });
                } catch (e) {
                    reply.type('application/json').code(500);
                    console.error(e);
                    return { error: `Unable to update object: error when saving`}
                }
            } else {
                reply.type('application/json').code(400);
                return { error: `Object ID in URL(${object.id ? object.id : undefined}) and in object model(${request.params.object ? request.params.object : undefined}) must be equal`};
            }
        } else {
            reply.type('application/json').code(400);
            return { error: `Unable to update object: object model hasn't been provided`}
        }
    }
}