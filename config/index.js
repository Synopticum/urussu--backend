module.exports = {
    get VK_SERVICE_KEY() {
        let serviceKeyLabel = process.argv.indexOf('--serviceKey');

        if (serviceKeyLabel >= 0 && serviceKeyLabel < process.argv.length - 1) {
            return process.argv[serviceKeyLabel + 1];
        }
    }
};