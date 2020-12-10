const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET auth page. */
router.get('/', function (req, res, next) {
    res.render('auth', { title: 'УСУКО МБОУ СОШ №28', error: "" });
});

/* POST auth page */
// TODO: Add error message when invalid passport
router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/auth',
}));

module.exports = router;
