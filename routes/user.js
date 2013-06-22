var User = require('../db').User;

exports.login = function (req, res) {
    res.render('login', {
        title: 'Login'
    });
}
exports.doLogin = function (req, res) {
    User.find({
        username: req.body.username,
        password: req.body.password
    }, function (err, users) {
        if (users.length) {
            // login success
            req.session.username = req.body.username;
            res.redirect('/');
        } else {
            // login failed
            res.send('Login failed!');
        }
    })
}
exports.reg = function (req, res) {
    res.render('reg', {
        title: 'Register'
    });
}
exports.doReg = function (req, res) {
    var u = {
        username: req.body.username,
        password: req.body.password
    };
    User.find(u, function (err, users) {
        if (users.length) {
            res.send('User was registed!');
        } else {
            var user = new User(u);
            user.save(function (err) {
                if (!err) {
                    res.send('Register success!');
                }
            });
        }
    })
}