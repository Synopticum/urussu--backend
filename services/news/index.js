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
                for (let rawItem of rawData[dataSource].items) {
                    // ignore if there is no text
                    if (rawItem.text) {
                        let item = {
                            dataSource,
                            text: News.cleanUpText(rawItem.text),
                            date: rawItem.date,
                            attachments: rawItem.attachments,
                            link: `https://vk.com/wall${rawItem.owner_id}_${rawItem.id}`,
                            isTatar: News.isTatar(rawItem.text)
                        };

                        _data.push(item);
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

        return { yutazinka, ktv, dk, mestoVstrechi };
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

    static isTatar(text) {
        return text.includes('ә') || text.includes('ә'.toUpperCase()) ||
               text.includes('ө') || text.includes('ө'.toUpperCase()) ||
               text.includes('ү') || text.includes('ү'.toUpperCase()) ||
               text.includes('җ') || text.includes('җ'.toUpperCase()) ||
               text.includes('ң') || text.includes('ң'.toUpperCase());
    }
}

let news = new News();