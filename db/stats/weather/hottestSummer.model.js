const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    main: {type: Object, required: true},
    dt_iso: {type: String, required: true},
});

let ItemModel = mongoose.model('Item', ItemSchema, 'weather_hottest_summer');
module.exports = ItemModel;
