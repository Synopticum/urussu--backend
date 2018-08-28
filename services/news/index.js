const { VK } = require('vk-io');
const vk = new VK();
const { VK_SERVICE_KEY } = require('../../config');
vk.setToken(VK_SERVICE_KEY);

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

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

class News {
    constructor() {
        this._data = null;
        this.lastUpdatedAt = null;
    }

    get data() {
        return this._data;
    }

    set data(rawData) {
        let _data = [];

        // go through all the data sources
        for (let dataSource of Object.keys(rawData)) {
            if (rawData[dataSource].items) {
                for (let item of rawData[dataSource].items) {
                    // ignore if there is no text
                    if (item.text) {
                        _data.push({
                            text: item.text,
                            date: item.date,
                            attachments: item.attachments,
                            link: `https://vk.com/wall${item.owner_id}_${item.id}`
                        });
                    }
                }
            }
        }

        this._data = _data;
    }

    isCacheAvailable() {
        return this.data && this.lastUpdatedAt;
    }

    isCacheValid() {
        return !this.lastUpdatedAt || Date.now() - this.lastUpdatedAt < 3600000;
    }
}

let news = new News();

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