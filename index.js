'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const attachRoutes = require('./routes');

const serverConfig = config.ENV === 'prod' ? {
    http2: true,
    https: {
        key: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'urussu', 'certs', 'secret.key')),
        cert: fs.readFileSync(path.join('/', 'home', 'ec2-user', 'urussu', 'certs', 'joined.crt'))
    }
} : null;

const fastify = require('fastify')(serverConfig);
const db  = require('./db');
const multer = require('fastify-multer');

fastify
    .use(require('cors')())
    .register(multer.contentParser);

attachRoutes(fastify);

fastify
    .listen(config.PORT, config.URI, function (err) {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`)
    });