const express = require('express');
const router = express.Router();
const connection = require("../mysql");
const utils = require("../utils/utils");

/* GET user page. */
router.get('/', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/auth');
    }

    if (req.user.type == 0) {
        // student's userpage
        return res.render('user0', {});
    } else if (req.user.type == 1) {
        // teacher's userpage
        return res.render('user1', {});
    } else if (req.user.type == 2) {
        // head teacher's (admin's) userpage
        if (req.query.type == 1) {
            // manage teachers subpage
            connection.query(`SELECT * FROM \`users\` WHERE \`type\` = 1`, (err, results) => {
                if (err) return console.error(err);
                return res.render('user2', {
                    title: "УСУКО | Личный Кабинет",
                    fullname: req.user.fullname,
                    type: 1,
                    table: results
                });
            });
        } else if (req.query.type == 2) {
            // manage classes subpage
        } else if (req.query.type == 3) {
            // tba
        } else {
            // default page
            return res.render('user2', {
                title: "УСУКО | Личный Кабинет",
                fullname: req.user.fullname,
                type: -1,
                table: []
            });
        }

    }
});

/**
 * handling remove teacher request
 */
router.get('/removeteacher', function (req, res, next) {
    // if user don't authorized redirect to login page
    if (!req.user) {
        return res.redirect('/auth');
    }

    // if user hasn't permissions redirect to userpage
    if (req.user.type != 2) return res.redirect('/user');
    const toremove = Object.keys(req.query);
    if (toremove.length != 1) return res.redirect('/user');
    connection.query(`DELETE FROM \`users\` WHERE \`id\` = ${toremove[0]}`);
    return res.redirect('/user?type=1');
});

/**
 * handling multiple remove teachers request
 */
router.post('/removeteachers', function (req, res, next) {
    // if user don't authorized redirect to login page
    if (!req.user) {
        return res.redirect('/auth');
    }

    // if user hasn't permissions redirect to userpage
    if (req.user.type != 2) return res.redirect('/user');
    const toremove = Object.keys(req.body).filter(str => str.startsWith("teacher_"));
    for (let i = 0; i < toremove.length; i++) {
        const id = toremove[i].split("_")[1];
        connection.query(`DELETE FROM \`users\` WHERE \`id\` = ${id}`, (err, results) => {
            if (err) return console.error(err);
            if (i == toremove.length - 1) {
                return res.redirect('/user?type=1');
            }
        });
    }
});

/**
 * hadnling add teacher request
 */
router.post('/addteacher', function (req, res, next) {
    // if user don't authorized redirect to login page
    if (!req.user) {
        return res.redirect('/auth');
    }

    // if user hasn't permissions redirect to userpage
    if (req.user.type != 2) return res.redirect('/user');
    const fullname = req.body.fullname;
    const subject = req.body.subject;
    const login = utils.rus_to_latin(req.body.fullname.split(/ +/g)[0].toLowerCase());
    const password = utils.generatePassword();
    connection.query(`SELECT \`id\` FROM \`users\``, (err, results) => {
        if (err) return console.error(err);
        const id = (results.length == 0 ? 0 : results[results.length - 1].id + 1);
        connection.query(`INSERT INTO \`users\` (\`fullname\`, \`subject\`, \`login\`, \`password\`, \`type\`) VALUES ('${fullname}', '${subject}', '${login}_${id}', '${password}', 1)`);
        return res.redirect('/user?type=1');
    });
});

/**
 * handling edit teacher request
 */
router.post('/editteacher', function (req, res, next) {
    // if user don't authorized redirect to login page
    if (!req.user) {
        return res.redirect('/auth');
    }

    // if user hasn't permissions redirect to userpage
    if (req.user.type != 2) return res.redirect('/user');
    const id = req.query.id;
    const fullname = req.body[`fullnameedit_${id}`];
    const subject = req.body[`subjectedit_${id}`];
    connection.query(`SELECT * FROM \`users\` WHERE \`id\` = ${id}`, (err, results) => {
        if (err) console.error(err);
        let send = [];
        if (fullname && fullname != results[0].fullname) {
            send.push(`\`fullname\` = '${fullname}'`);
            const login = utils.rus_to_latin(
                fullname.split(/ +/g)[0].toLowerCase()
            );
            send.push(`\`login\` = '${login}_${id}'`);
        }
        if (subject && subject != results[0].subject) send.push(`\`subject\` = '${subject}'`);
        if (send.length > 0) {
            const sql = `UPDATE \`users\` SET ${send.join(', ')} WHERE \`id\` = ${id}`;
            connection.query(sql, (err) => {
                if (err) console.error(err);
                return res.redirect('/user?type=1');
            });
        } else {
            return res.redirect('/user?type=1');
        }
    });
});

/**
 * reset password handler
 */
router.get('/resetpassword', (req, res, next) => {
    // if user don't authorized redirect to login page
    if (!req.user) {
        return res.redirect('/auth');
    }

    // if user hasn't permissions redirect to userpage
    if (req.user.type != 2) return res.redirect('/user');
    const id = req.query.id;
    const newPassword = utils.generatePassword();
    connection.query(`UPDATE \`users\` SET \`password\` = '${newPassword}' WHERE \`id\` = ${id}`, (err) => {
        if (err) return console.error(err);
        return res.redirect('/user?type=1');
    });
})

// TODO: #1 Придумать куда засунуть кнопку сброса пароля

module.exports = router;