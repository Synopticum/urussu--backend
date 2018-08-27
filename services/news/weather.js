const Crawler = require('crawler');
const crawler = new Crawler({
    jQuery: true,
    maxConnections: 10
});

module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function getWeatherData() {
    return new Promise((resolve, reject) => {
        crawler.direct({
            uri: 'https://www.gismeteo.com/weather-urussu-11350/',
            skipEventRequest: false,
            callback: function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        let $ = response.$;
                        let currentTemperature = $('.js_meas_container.temperature.tab-weather__value .js_value').text().trim();
                        let feelingTemperature = $('.tab-weather__feel-value').text().trim();
                        let sky = $('.tab.tablink.tooltip').attr('data-text').toLowerCase();
                        resolve({ currentTemperature, feelingTemperature, sky });
                    } catch (e) {
                        reject(e);
                    }
                }
            }
        });
    });
}

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/news/weather',
        handler: async function (request, reply) {
            try {
                let data = await getWeatherData();
                reply.code(200);
                return data;
            } catch (e) {
                reply.code(500);
                return e;
            }
        }
    });
}