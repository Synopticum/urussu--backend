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
                news.data = await News.fetch();
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
                            dataSource,
                            text: News.cleanUpText(item.text),
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

    static async fetch() {
        const yutazinka = await News._getFromVk('yutazinka');
        const ktv = await News._getFromVk('ktv');
        const dk = await News._getFromVk('dk');
        const mestoVstrechi = await News._getFromVk('mestoVstrechi');

        return { yutazinka, ktv, dk, mestoVstrechi }
    }

    static async _getFromVk(dataSource) {
        switch (dataSource) {
            case 'yutazinka':
                return await vk.api.wall.get({ owner_id: -33411279 });
            case 'ktv':
                return await vk.api.wall.get({ owner_id: -53412022 });
            case 'dk':
                return await vk.api.wall.get({ owner_id: -138073975 });
            case 'mestoVstrechi':
                return await vk.api.wall.get({ owner_id: -121438510 });
        }
    }

    static cleanUpText(text) {
        let cleanedText = News._removeUrisFromText(text);
        return News._removeEmojisFromText(cleanedText);
    }

    static _removeUrisFromText(text) {
        try {
            return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        } catch (e) {
            return text;
        }
    }

    static _removeEmojisFromText(text) {
        try {
            return text.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        } catch (e) {
            return text;
        }
    }
}

let news = new News();