const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    uid: {type: Schema.ObjectId, required: true},
    vkId: {type: Number},
    tokenExpiresIn: {type: Number},
    firstName: {type: String},
    lastName: {type: String},
    token: {type: String},
    role: {type: String, default: 'member'}
}, { uid: false });

let UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;