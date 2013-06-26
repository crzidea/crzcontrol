var mongoese = require('mongoose')
    , Schema = mongoese.Schema
    , ObjectId = Schema.ObjectId;

// user schema
var UserSchema = new Schema({
    username: String,
    password: String
});
exports.User = mongoese.model('user', UserSchema);

// cmdmsg Schema
var CmdMsgSchema = new Schema({
    msg: Object,
    sendTime: Date
});
exports.CmdMsg = mongoese.model('cmdmsg', CmdMsgSchema);
