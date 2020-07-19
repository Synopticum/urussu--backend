const DotModel = require('../db/dot.model');
const ObjectModel = require('../db/object.model');
const PathModel = require('../db/path.model');
const { s3 } = require('../config/aws');

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
    },

    removePhotosFromS3(keys) {
        return new Promise((resolve, reject) => {
            s3.deleteObjects({
                Delete: {
                    Objects: keys,
                    Quiet: false
                }
            }, (err, data) => {
                if (err) {
                    console.error('There was an error deleting photos: ', err.message);
                    reject(err.message);
                }

                resolve(data);
            });
        });
    }
};