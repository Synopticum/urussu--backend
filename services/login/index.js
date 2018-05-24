const fetch = require('node-fetch');

module.exports = async function (fastify, opts) {
  fastify
    .register(registerRoutes);
}

async function registerRoutes(fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/login/check',
    handler: async function verifyVkAuth(request, reply) {
      let accessToken = request.headers['vk-access-token'];

      if (accessToken) {
        let response = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.74`);
        let json = await response.json();

        if (!json.error) {
          reply.code(200).send(json);
        } else {
          reply.code(401).send(json);
        }
      }
    }
  });
}