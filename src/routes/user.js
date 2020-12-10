const express = require('express');
const router = express.Router();

/* GET user page. */
router.get('/', function (req, res, next) {
    console.log(req.user);
    if (!req.user) {
        res.redirect('/auth');
    } else {
        res.send(req.user);
    }
});

module.exports = router;
