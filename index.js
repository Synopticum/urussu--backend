'use strict';
const fs = require('fs');
const path = require('path');
const config = require('./config');

const serverConfig = config.ENV === 'prod' ? {
    http2: true,
    https: {
        key: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'secret.key')),
        cert: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'joined.crt'))
    }
} : null;

const fastify = require('fastify')(serverConfig);
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
    .listen(config.PORT, config.URI, function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });