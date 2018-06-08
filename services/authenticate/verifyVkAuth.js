const fetch = require('node-fetch');

module.exports = async function verifyVkAuth(request, reply, done) {
    let code = request.headers['vk-auth-code'];
    let accessToken = await getAccessToken(code);

    if (accessToken) {
        let response = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.78`);
        let json = await response.json();

        return !json.error ? done() : done(new Error('Unauthorized'));
    }
};

async function getAccessToken(code) {
    let response = await fetch(`https://oauth.vk.com/access_token?client_id=4447151&client_secret=bk2AL0XGFoyUjWmFWBcX&redirect_uri=http://localhost:8081&code=${code}`);
    let json = await response.json();

    return !json.error ? json.access_token : '';
}