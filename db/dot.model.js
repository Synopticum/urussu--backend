const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DotSchema = new Schema({
    id: {type: String, required: true},
    type: {type: String, required: true},
    layer: {type: String, required: true},
    coordinates: {type: Array, required: true},

    title: {type: String, required: false},
    shortDescription: {type: String, required: false},
    fullDescription: {type: String, required: false},
    images: {
        thumbnailUrl: {type: String, required: false}
    }
}, { id: false });

let DotModel = mongoose.model('Dot', DotSchema);
module.exports = DotModel;