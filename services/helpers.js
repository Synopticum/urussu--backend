const DotModel = require('../db/dot.model');
const ObjectModel = require('../db/object.model');
const PathModel = require('../db/path.model');

module.exports = {
    getModel(type) {
        switch (type) {
            case 'dot':
                return DotModel;

            case 'object':
                return ObjectModel;

            case 'path':
                return PathModel;
        }
    },

    getType(params) {
        if (params.object) {
            return 'object';
        } else if (params.path) {
            return 'path';
        } else {
            return {error: `Unable to identify requested model type`};
        }
    }
};