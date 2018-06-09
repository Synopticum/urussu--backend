const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id: {type: Schema.ObjectId, required: true},
    vkId: {type: Number},
    tokenExpiresIn: {type: Date},
    firstName: {type: String},
    lastName: {type: String},
    token: {type: String}
}, { _id: false });

let UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;