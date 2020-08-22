const ObjectModel = require('../../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/stats/addresses',
        handler: get
    });

    async function get(request, reply) {
        const value = request.query.value;

        try {
            reply.type('application/json').code(200);
            return await findTestStats(value);
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get addresses: error when finding in db`}
        }
    }
}

async function findTestStats () {
    const query = { house: { $nin: ['', undefined] }, street: { $nin: ['', undefined] } };
    return await ObjectModel.find(query, ['street', 'house', 'id']).select({ '_id': 0 });
}
