const mongoose = require('mongoose');
const ObjectModel = require('../../db/object.model');
const verifyVkAuth = require('../authenticate/verifyVkAuth');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/objects/:object',
        handler: get
    });

    async function get(request, reply) {
        let objectId = request.params.object;

        try {
            let object = await ObjectModel.findOne({ _id: mongoose.Types.ObjectId(objectId) });
            reply.type('application/json').code(200);
            return object;
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get object: error when finding in db`}
        }
    }
}