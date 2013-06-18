var mongoese = require('mongoose')
    , Schema = mongoese.Schema
    , ObjectId = Schema.ObjectId;

// user schema
var UserSchema = new Schema({
    username: String,
    password: String
});
exports.User = mongoese.model('user', UserSchema);
