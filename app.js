/**
 * Module dependencies.
 */
var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose')
    , socketio = require('socket.io')
    , websocket = require('./websocket');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', user.login);
app.post('/login', user.doLogin);
app.get('/reg', user.reg);
app.post('/reg', user.doReg);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// hello mongodb
mongoose.connect('mongodb://localhost/crzcontrol', function (err) {
    if (!err) {
        console.log('Connected to MongoDB');
    } else {
        throw err;
    }
});

// finally socket.io
var io = socketio.listen(server, {
    log: false
});
websocket.init(io);
