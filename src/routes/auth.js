const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET auth page. */
router.get('/', function (req, res, next) {
    res.render('auth', { title: 'УСУКО МБОУ СОШ №28', error: "" });
});

/* POST auth page */
router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render("auth", { title: 'УСУКО МБОУ СОШ №28', error: "Неверный логин или пароль" });
        }
        req.logIn(user, (err) => {
            if (err) console.error(err);
            return res.redirect('/user');
        });
    })(req, res, next);
});

module.exports = router;
