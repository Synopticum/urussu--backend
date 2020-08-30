const multer = require('fastify-multer');

const rootPath = './services';
const prefix = '/api';

const routes = [
    { value: '/authenticate' },
    { value: '/authenticate/checkToken' },
    { value: '/user/get' },
    { value: '/user/avatar/get' },
    { value: '/dots/get' },
    { value: '/dot/get' },
    { value: '/dot/put' },
    { value: '/dot/delete' },
    { value: '/objects/get' },
    { value: '/object/get' },
    { value: '/object/put' },
    { value: '/object/delete' },
    { value: '/paths/get' },
    { value: '/comments/get' },
    { value: '/comment/put' },
    { value: '/comment/delete' },
    { value: '/upload/put', options: { multer } },
    { value: '/upload/delete', options: { multer } },
    { value: '/search/get' },
    { value: '/stats/addresses/get' },
    { value: '/stats/population/get' },
    { value: '/stats/weather/hottestSummer/get' },
];

module.exports = attachRoutes = (fastify) => {
    for (const route of routes) {
        fastify.register(require(`${rootPath}${route.value}`), { prefix, ...route.options });
    }
};