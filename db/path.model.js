const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PathSchema = new Schema({
    id: {type: String, required: true},
    instanceType: {type: String, required: true},
    type: {type: String, required: true},
    coordinates: {type: Array, required: true},

    title: {type: String, required: false},
    shortDescription: {type: String, required: false},
    fullDescription: {type: String, required: false},

    thumbnail: {type: String, required: false},
    images: {type: Object, required: false},
}, {id: false});

let PathModel = mongoose.model('Path', PathSchema, 'paths');
module.exports = PathModel;