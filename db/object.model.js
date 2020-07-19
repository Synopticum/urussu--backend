const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ObjectSchema = new Schema({
    // common
    id: {type: String, required: true},
    instanceType: {type: String, required: true},
    type: {type: String, required: true},
    coordinates: {type: Array, required: true},

    title: {type: String, required: false},
    shortDescription: {type: String, required: false},
    fullDescription: {type: String, required: false},

    thumbnail: {type: String, required: false},
    images: {type: Object, required: false},

    // object
    street: {type: String, required: false},
    house: {type: String, required: false},

    // circle
    radius: {type: Number, required: false},
}, {id: false});

let ObjectModel = mongoose.model('Object', ObjectSchema);
module.exports = ObjectModel;