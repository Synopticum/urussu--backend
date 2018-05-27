'use strict';
const fs = require('fs');
const path = require('path');

const fastify = require('fastify')({
    // http2: true,
    // https: {
    //     key: fs.readFileSync(path.join(__dirname, '.', 'config', 'certs', 'localhost.key')),
    //     cert: fs.readFileSync(path.join(__dirname, '.', 'config', 'certs', 'localhost.cert'))
    // }
});
const db  = require('./db');

fastify
    .use(require('cors')())
    .register(require('fastify-auth'))
    .decorate('verifyVkAuth', require('./services/login/verifyVkAuth'))
    .register(require('./services/login'), { prefix: '/api' })
    .register(require('./services/objects'), { prefix: '/api' })
    .register(require('./services/objects/paths'), { prefix: '/api' })
    .register(require('./services/objects/circles'), { prefix: '/api' })
    .register(require('./services/news'), { prefix: '/api' })
    .listen(3000, 'localhost', function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });