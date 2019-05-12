const config = {
    get PORT() {
        return getValueFor('port');
    },

    get URI() {
        return getValueFor('uri');
    },

    get ENV() {
        return getValueFor('env');
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
    },

    get IDENTITY_POOL_ID() {
        return getValueFor('identityPoolId');
    }
};

function getValueFor(argument) {
    let label = process.argv.indexOf(`--${argument}`);

    if (label >= 0 && label < process.argv.length - 1) {
        return process.argv[label + 1];
    }

    return '';
}

if (!config.PORT || !config.URI || !config.VK_SERVICE_KEY || !config.VK_CLIENT_ID || !config.VK_CLIENT_SECRET || !config.VK_API_VERSION) {
    const checkMark = '\x1b[32m✔';
    const xMark = '\x1b[31m✘';

    throw new Error(`
        Some required params haven't been provided:
        
        \x1b[37m Environment:-------------------${config.ENV ? `${config.ENV} ${checkMark}` : xMark}
        \x1b[37m Port:--------------------------${config.PORT ? `${config.PORT} ${checkMark}` : xMark}
        \x1b[37m Server URI:--------------------${config.URI ? `${config.URI} ${checkMark}` : xMark}
        \x1b[37m VK Service Key:----------------${config.VK_SERVICE_KEY ? `${config.VK_SERVICE_KEY} ${checkMark}` : xMark}
        \x1b[37m VK Client ID:------------------${config.VK_CLIENT_ID ? `${config.VK_CLIENT_ID} ${checkMark}` : xMark}
        \x1b[37m VK Client Secret:--------------${config.VK_CLIENT_SECRET ? `${config.VK_CLIENT_SECRET} ${checkMark}` : xMark}
        \x1b[37m VK API Version:----------------${config.VK_API_VERSION ? `${config.VK_API_VERSION} ${checkMark}` : xMark}
        \x1b[37m AWS Cognite Identity Pool ID:--${config.IDENTITY_POOL_ID ? `${config.IDENTITY_POOL_ID} ${checkMark}` : xMark}
        \x1b[37m`);
}

module.exports = config;