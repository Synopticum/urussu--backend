const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    id: {type: String, required: true},
    originType: {type: String, required: true},
    originId: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: String, required: false},
    author: {type: String, required: false}
}, { id: false });

let CommentModel = mongoose.model('Comment', CommentSchema);
module.exports = CommentModel;