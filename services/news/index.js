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
                        let text = News.cleanUpText(rawItem.text);

                        if (text) {
                            let item = {
                                dataSource,
                                text,
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

    static cleanUpText(rawText) {
        let cleanedText = News._removeUrisFromText(rawText);
        cleanedText = News._correctQuotes(cleanedText);
        cleanedText = News._unwrapVkLinks(cleanedText);
        return News._removeEmojisFromText(cleanedText);
    }

    static _removeUrisFromText(rawText) {
        try {
            return rawText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        } catch (e) {
            return rawText;
        }
    }

    static _removeEmojisFromText(rawText) {
        try {
            return rawText.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        } catch (e) {
            return rawText;
        }
    }

    static _correctQuotes(rawText) {
        return rawText.replace(/"([^"]*)"/g, '«$1»');
    }

    static _unwrapVkLinks(rawText) {
        return rawText.replace(/\[(.*?)\]/g, (match, contents, offset, input_string) => {
            return match.substring(match.indexOf('|')+1, match.length-1);
        });
    }

    static isTatar(rawText) {
        return rawText.includes('ә') || rawText.includes('ә'.toUpperCase()) ||
               rawText.includes('ө') || rawText.includes('ө'.toUpperCase()) ||
               rawText.includes('ү') || rawText.includes('ү'.toUpperCase()) ||
               rawText.includes('җ') || rawText.includes('җ'.toUpperCase()) ||
               rawText.includes('ң') || rawText.includes('ң'.toUpperCase());
    }
}

let news = new News();