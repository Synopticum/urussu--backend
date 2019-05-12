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

const multer = require('fastify-multer');

fastify
    .use(require('cors')())
    .register(require('fastify-auth'))
    .register(multer.contentParser)
    .decorate('verifyVkAuth', require('./services/authenticate/verifyVkAuth'))
    .register(require('./services/authenticate'), { prefix })
    .register(require('./services/authenticate/checkToken'), { prefix })
    .register(require('./services/user'), { prefix })
    .register(require('./services/dots'), { prefix })
    .register(require('./services/dots/dot'), { prefix })
    .register(require('./services/objects'), { prefix })
    .register(require('./services/objects/object'), { prefix })
    .register(require('./services/comments'), { prefix })
    .register(require('./services/comments/comment'), { prefix })
    .register(require('./services/upload'), { prefix, multer })
    .register(require('./services/news'), { prefix })
    .register(require('./services/news/weather'), { prefix })
    .listen(config.PORT, config.URI, function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });