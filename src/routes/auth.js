const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('auth', { title: 'УСУКО МБОУ СОШ №28' });
});

module.exports = router;
