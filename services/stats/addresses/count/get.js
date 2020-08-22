const ObjectModel = require('../../../../db/object.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/stats/addresses/count',
        handler: get
    });

    async function get(request, reply) {
        try {
            reply.type('application/json').code(200);
            return await getAddressesCount();
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get addresses: error when finding in db`}
        }
    }
}

async function getAddressesCount () {
    const query = { house: { $nin: ['', undefined] }, street: { $nin: ['', undefined] } };
    const addresses = await ObjectModel.find(query, ['street', 'house', 'id']).select({ '_id': 0 });
    const streets = new Set(addresses.map(address => address.street));
    let result = [];

    for (const street of streets) {
        result.push({
            street,
            count: await ObjectModel.countDocuments({ street })
        });
    }

    return result;
}
