const DotModel = require('../../db/dot.model');
const ObjectModel = require('../../db/object.model');

module.exports = {
    getModel(type) {
        switch (type) {
            case 'dot':
                return DotModel;

            case 'object':
                return ObjectModel;
        }
    }
};