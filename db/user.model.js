const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    id: {type: String, required: true},
    vkId: {type: Number},
    tokenExpiresIn: {type: Number},
    firstName: {type: String},
    lastName: {type: String},
    token: {type: String},
    role: {type: String, default: 'member'}
}, { id: false });

let UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;