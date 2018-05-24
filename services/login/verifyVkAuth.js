const fetch = require('node-fetch');

module.exports = async function verifyVkAuth(request, reply, done) {
  let accessToken = request.headers['vk-access-token'];

  if (accessToken) {
    let response = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.74`);
    let json = await response.json();

    if (!json.error) {
      done();
    } else {
      done(new Error('Unauthorized'));
    }
  }
}