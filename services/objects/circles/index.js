const ObjectModel = require('../../../db/object.model');

module.exports = async function (fastify, opts) {
  fastify
    .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/objects/coordinates/circles',
    beforeHandler: fastify.auth([fastify.verifyVkAuth]),
    handler: async function(request, reply) {
      reply.type('application/json').code(200);
      const circles = await getCirclesCoordinates();
      return circles;
    }
  });

  async function getCirclesCoordinates() {
    const circles = await ObjectModel.find({ type: 'circle' }).select({ '_id': 0, 'type': 0});
    return circles;
  }
}