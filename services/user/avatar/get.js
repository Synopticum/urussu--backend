const fetch = require('node-fetch');
const UserModel = require('../../../db/user.model');
const { VK_SERVICE_KEY, VK_API_VERSION } = require('../../../config');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/users/:user/avatar',
        handler: getDefault
    });
}

async function getDefault(request, reply) {
    let id = request.params.user;
    let user = await UserModel.findOne({ id }).select({ '_id': 0, '__v': 0 });

    if (!user) {
        reply.type('application/json').code(404);
        return { error: 'User not found'};
    }

    reply.type('application/json').code(200);
    return await prepareResponse(user);
}

async function prepareResponse(user) {
    const vkId = user._doc.vkId;
    return await getAvatarUrlFromVkApi(vkId);
}

async function getAvatarUrlFromVkApi(vkId) {
    let response = await fetch(`https://api.vk.com/method/users.get?access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}&user_ids=${vkId}&fields=photo_100`);
    let json = await response.json();
    const avatarUrl = json.response && json.response[0] ? json.response[0].photo_100 : null;

    return avatarUrl;
}