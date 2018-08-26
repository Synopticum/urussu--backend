module.exports = {
    get PORT() {
        return getValueFor('port');
    },

    get URI() {
        return getValueFor('uri');
    },

    get VK_SERVICE_KEY() {
        return getValueFor('serviceKey');
    },

    get VK_CLIENT_ID() {
        return getValueFor('clientId');
    },

    get VK_CLIENT_SECRET() {
        return getValueFor('clientSecret');
    },

    get VK_API_VERSION() {
        return getValueFor('apiVersion');
    }
};

function getValueFor(argument) {
    let label = process.argv.indexOf(`--${argument}`);

    if (label >= 0 && label < process.argv.length - 1) {
        return process.argv[label + 1];
    }

    return '';
}