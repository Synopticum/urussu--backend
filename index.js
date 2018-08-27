'use strict';
const fs = require('fs');
const path = require('path');
const { PORT, URI } = require('./config');

const fastify = require('fastify')({
    // http2: true,
    // https: {
    //     key: fs.readFileSync(path.join(__dirname, '.', 'config', 'certs', 'localhost.key')),
    //     cert: fs.readFileSync(path.join(__dirname, '.', 'config', 'certs', 'localhost.cert'))
    // }
});
const db  = require('./db');
const prefix = '/api';

fastify
    .use(require('cors')())
    .register(require('fastify-auth'))
    .decorate('verifyVkAuth', require('./services/authenticate/verifyVkAuth'))
    .register(require('./services/authenticate'), { prefix })
    .register(require('./services/authenticate/checkToken'), { prefix })
    .register(require('./services/objects'), { prefix })
    .register(require('./services/objects/object'), { prefix })
    .register(require('./services/objects/coordinates/paths'), { prefix })
    .register(require('./services/objects/coordinates/circles'), { prefix })
    .register(require('./services/news'), { prefix })
    .register(require('./services/news/weather'), { prefix })
    .listen(PORT, URI, function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });