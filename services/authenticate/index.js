const fetch = require('node-fetch');

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/authenticate',
        handler: async function verifyVkAuth(request, reply) {
            let code = request.query.code;
            let accessToken;

            if (code) {
                accessToken = await getAccessToken(code);

                if (accessToken) {
                    let response = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.78`);
                    let json = await response.json();

                    if (!json.error) {
                        reply.code(200);
                        return json;
                    }
                }
            }

            reply.code(401);
            return { error: 401 };
        }
    });
}

async function getAccessToken(code) {
    let response = await fetch(`https://oauth.vk.com/access_token?client_id=4447151&client_secret=bk2AL0XGFoyUjWmFWBcX&redirect_uri=http://localhost:8081&code=${code}`);
    let json = await response.json();

    return !json.error ? json.access_token : '';
}