const ObjectModel = require('../../db/object.model');

module.exports = async function (fastify, opts) {
  fastify
    .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/objects',
    beforeHandler: fastify.auth([fastify.verifyVkAuth]),
    handler: async function(request, reply) {
      if (request.query && request.query.coordinates) {
        reply.type('application/json').code(200);
        const coordinates = JSON.parse(request.query.coordinates);
        const objects = await getObjectsByCoordinates(coordinates);
        return objects;
      }
    }
  });

  async function getObjectsByCoordinates(coordinates) {
    const objects = await ObjectModel.findOne({ coordinates });
    return objects;
  }

}