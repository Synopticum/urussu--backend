const { VK } = require('vk-io');
const vk = new VK();
const { VK_SERVICE_KEY } = require('../../config');
vk.setToken(VK_SERVICE_KEY);

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

class News {
    constructor() {
        this.data = null;
        this.lastUpdatedAt = null;
    }

    isCacheAvailable() {
        return this.data && this.lastUpdatedAt;
    }

    isCacheValid() {
        return !this.lastUpdatedAt || Date.now() - this.lastUpdatedAt < 3600000;
    }
}

let news = new News();

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/news',
        handler: async function () {
            if (!news.isCacheAvailable() || !news.isCacheValid()) {
                news.data = await getNews();
                news.lastUpdatedAt = Date.now();
            }

            return news.data;
        }
    });
}

async function getNews() {
    const yutazinka = await _getYutazinka();
    const ktv = await _getKtv();
    const dk = await _getDk();
    const mestoVstrechi = await _getMestoVstrechi();

    return { yutazinka, ktv, dk, mestoVstrechi }
}

// data sources
async function _getYutazinka() {
    return await vk.api.wall.get({
        owner_id: -33411279
    });
}

async function _getKtv() {
    return await vk.api.wall.get({
        owner_id: -53412022
    });
}

async function _getDk() {
    return await vk.api.wall.get({
        owner_id: -138073975
    });
}

async function _getMestoVstrechi() {
    return await vk.api.wall.get({
        owner_id: -121438510
    });
}