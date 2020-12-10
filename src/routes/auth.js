const express = require('express');
const router = express.Router();

/* GET auth page. */
router.get('/', function (req, res, next) {
    res.render('auth', { title: 'УСУКО МБОУ СОШ №28' });
});

/* POST auth page */
router.post('/', function (req, res, next) {
    req.database.query(`SELECT * FROM \`users\` WHERE \`login\` = '${req.body.uname}'`, (err, results, fields) => {
        if (err) console.error(err);
        if (results.length == 0 || results[0].password != req.body.pass) {
            res.render('auth', {
                title: "УСОКО МБОУ СОШ №28",
                error: "Неверный логин или пароль"
            });
        } else {
            req.user = {
                id: results[0].id,
                type: results[0].type,
                fullname: results[0].fullname
            };
            res.redirect('/user');
        }
    });
});

module.exports = router;
