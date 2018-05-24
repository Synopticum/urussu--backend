const ObjectModel = require('../../../db/object.model');

module.exports = async function (fastify, opts) {
  fastify
    .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/objects/coordinates/paths',
    beforeHandler: fastify.auth([fastify.verifyVkAuth]),
    handler: async function (request, reply) {
      reply.type('application/json').code(200);
      const paths = await getPathsCoordinates();
      return paths;
    }
  });

  async function getPathsCoordinates() {
    const paths = await ObjectModel.find({ type: 'path' });
    return paths;
  }
}