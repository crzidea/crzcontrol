var User = require('../db').User;
/*
 * GET home page.
 */

exports.index = function (req, res) {
    if (req.session.username) {
        res.render('index', {
            title: 'CrzControl',
            user: req.session.username
        });
    } else {
        res.redirect('login');
    }
};