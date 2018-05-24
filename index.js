'use strict'

const db  = require('./db');
const fetch = require('node-fetch');

module.exports = async function (fastify, opts) {
  fastify
    .use(require('cors')())
    .register(require('fastify-auth'))
    .decorate('verifyVkAuth', require('./services/login/verifyVkAuth'))
    .register(require('./services/login'), { prefix: '/api' })
    .register(require('./services/objects'), { prefix: '/api' })
    .register(require('./services/objects/paths'), { prefix: '/api' })
    .register(require('./services/objects/circles'), { prefix: '/api' });
}
