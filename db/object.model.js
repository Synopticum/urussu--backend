const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ObjectSchema = new Schema({
    _id: {type: Schema.ObjectId},
    type: {type: String, required: true},
    coordinates: {type: Array, required: true},

    title: {type: String, required: false},
    shortDescription: {type: String, required: false},
    fullDescription: {type: String, required: false},
    address: {type: String, required: false},
    images: {
        thumbnailUrl: {type: String, required: false}
    }
}, { _id: false });

let ObjectModel = mongoose.model('Object', ObjectSchema);
module.exports = ObjectModel;