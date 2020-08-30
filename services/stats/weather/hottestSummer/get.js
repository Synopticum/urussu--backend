const ItemModel = require('../../../../db/stats/weather/hottestSummer.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/stats/weather/hottest-summer',
        handler: get
    });

    async function get(request, reply) {
        try {
            reply.type('application/json').code(200);
            return await getItems();
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get items: error when finding in db`}
        }
    }
}

async function getItems () {
    return await ItemModel.find({});
}
