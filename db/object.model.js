const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ObjectSchema = new Schema({
    id: {type: String, required: true},
    instanceType: {type: String, required: true},
    type: {type: String, required: true},
    coordinates: {type: Array, required: true},
    radius: { type: Number, required: false },

    title: {type: String, required: false},
    shortDescription: {type: String, required: false},
    fullDescription: {type: String, required: false},
    address: {type: String, required: false},
    images: {
        thumbnailUrl: {type: String, required: false}
    }
}, { id: false });

let ObjectModel = mongoose.model('Object', ObjectSchema);
module.exports = ObjectModel;