module.exports = async function (fastify, opts) {
    fastify
        .register(registerRoutes);
};

async function registerRoutes(fastify, opts) {
    fastify.route({
        method: 'GET',
        url: '/stats/population',
        handler: get
    });

    async function get(request, reply) {
        try {
            reply.type('application/json').code(200);
            return getPopulation();
        } catch (e) {
            reply.type('application/json').code(500);
            console.error(e);
            return { error: `Unable to get addresses: error when finding in db`}
        }
    }
}

function getPopulation () {
    return [
        { year: 1959, value: 11572 },
        { year: 1970, value: 11929 },
        { year: 1979, value: 10738 },
        { year: 1989, value: 10663 },
        { year: 2002, value: 11258 },
        { year: 2005, value: 11082 },
        { year: 2006, value: 11059 },
        { year: 2007, value: 11104 },
        { year: 2009, value: 11040 },
        { year: 2010, value: 10681 },
        { year: 2011, value: 10666 },
        { year: 2012, value: 10558 },
        { year: 2013, value: 10543 },
        { year: 2014, value: 10561 },
        { year: 2015, value: 10577 },
        { year: 2016, value: 10637 },
        { year: 2017, value: 10570 },
        { year: 2018, value: 10551 },
        { year: 2019, value: 10584 },
        { year: 2020, value: 10633 }
    ];
}
