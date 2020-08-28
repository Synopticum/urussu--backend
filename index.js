'use strict';
const fs = require('fs');
const path = require('path');
const config = require('./config');

const serverConfig = config.ENV === 'prod' ? {
    http2: true,
    https: {
        key: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'urussu', 'certs', 'secret.key')),
        cert: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'urussu', 'certs', 'joined.crt'))
    }
} : null;

const fastify = require('fastify')(serverConfig);
const db  = require('./db');
const prefix = '/api';

const multer = require('fastify-multer');

fastify
    .use(require('cors')())
    .register(multer.contentParser)
    .register(require('./services/authenticate'), { prefix })
    .register(require('./services/authenticate/checkToken'), { prefix })
    .register(require('./services/user/get'), { prefix })
    .register(require('./services/user/avatar/get'), { prefix })
    .register(require('./services/dots/get'), { prefix })
    .register(require('./services/dot/get'), { prefix })
    .register(require('./services/dot/put'), { prefix })
    .register(require('./services/dot/delete'), { prefix })
    .register(require('./services/objects/get'), { prefix })
    .register(require('./services/object/get'), { prefix })
    .register(require('./services/object/put'), { prefix })
    .register(require('./services/object/delete'), { prefix })
    .register(require('./services/paths/get'), { prefix })
    .register(require('./services/comments/get'), { prefix })
    .register(require('./services/comment/put'), { prefix })
    .register(require('./services/comment/delete'), { prefix })
    .register(require('./services/upload/put'), { prefix, multer })
    .register(require('./services/upload/delete'), { prefix, multer })
    .register(require('./services/search/get'), { prefix })
    .register(require('./services/stats/addresses/get'), { prefix })
    .register(require('./services/stats/population/get'), { prefix })
    .listen(config.PORT, config.URI, function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });