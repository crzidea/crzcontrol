var sio = require('socket.io')
    , User = require('./db').User;

var server;
var userSockets = {};
exports.init = function (httpServer) {
    server = sio.listen(httpServer, {
        log: false
    });
    initServer();
};

function initServer() {
    setSession();
    server.sockets.on('connection', function (socket) {
        setSocketEvents(socket);
    });
}

function setSession() {
    // TODO: visit http://js8.in/788.html
}

function setSocketEvents(socket) {
    socket.on('login', function (data) {
        switch (data.from) {
            case 'pc':
            case 'mobile':
                loginCheck(data, this);
                break;
            case 'web':
                addUser2List(data, this);
                this.emit('loginSuccess', {
                    msg: 'You have logined the CrzControl. Enjoy!'
                });
                break;
            default :
                this.emit('loginFailed', {
                    msg: 'Unknown Device! Please do not try to hack my app!!!'
                });
        }
    });
    socket.on('command', function (data) {
        switch (data.from) {
            case 'web':
                command2PC(data, this);
                break;
            case 'pc':
            case 'mobile':
            default :
                break;
        }
    });
    socket.on('cmdComplete', function (data) {
        result2Web(data);
    });
}

function loginCheck(data, socket) {
    var user = {
        username: data.user,
        password: data.pass
    }
    User.find(user, function (err, users) {
        if (!users.length || err) {
            socket.emit('loginFailed', {
                msg: 'Something was wrong with your username or password!'
            });
        } else {
            addUser2List(data, socket);
            socket.emit('loginSuccess', {
                msg: 'You have logined the CrzControl. Enjoy!'
            });
        }
    })
}

function addUser2List(data, socket) {
    userSockets[data.user] = userSockets[data.user] || {};
    userSockets[data.user][data.from] = socket;
}

function command2PC(data, srcSocket) {
    data.target = 'pc';
    translateMsg('command', data, srcSocket);
}

function result2Web(data) {
    data.target = 'web';
    translateMsg('cmdComplete', data)
}
function translateMsg(event, data, srcSocket) {
    pcSocket = userSockets[data.user][data.target];
    if (pcSocket && !pcSocket.disconnected) {
        pcSocket.emit(event, data);
    } else if (srcSocket) {
        srcSocket.emit('cmdComplete', {
            msg: 'PC client is not online at the time.'
        })
    }

}