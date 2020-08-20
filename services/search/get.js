const ObjectModel = require('../../db/object.model');
const DotModel = require('../../db/dot.model');
const PathModel = require('../../db/path.model');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/search',
        handler: get
    });

    async function get(request, reply) {
        const value = request.query.value;

        try {
            reply.type('application/json').code(200);

            if (value) {
                let objectsResult = await findObjectsByStreet(value);
                let dotsResult = await findDotsByTitle(value);
                let pathsResult = await findPathsByTitle(value);
                let finalResult;

                if (!objectsResult.length) {
                    objectsResult = await findObjectsByTitle(value);
                }

                finalResult = pathsResult.concat(objectsResult.concat(dotsResult));

                return finalResult;
            }

            return [];
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get dots: error when finding in db`}
        }
    }
}

async function findObjectsByStreet (value) {
    return await ObjectModel.find({ street: { '$regex': value, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
}

async function findObjectsByTitle (value) {
    return await ObjectModel.find({ title: { '$regex': value, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
}

async function findDotsByTitle (value) {
    return await DotModel.find({ title: { '$regex': value, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
}

async function findPathsByTitle (value) {
    return await PathModel.find({ title: { '$regex': value, '$options': 'i' } }).select({ '_id': 0, '__v': 0});
}