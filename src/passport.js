const passport = require("passport");
const connection = require('./mysql');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configure
 */
passport.use(new LocalStrategy({
    usernameField: "uname",
    passwordField: "pass"
},
    function (username, password, done) {
        connection.query(`SELECT * FROM \`users\` WHERE \`login\` = '${username}'`, (err, results, fields) => {
            if (err) return console.error(err);
            if (!results || results.length == 0 || results[0].password != password) {
                return done(null, false);
            } else {
                const user = {
                    id: results[0].id,
                    type: results[0].type,
                    fullname: results[0].fullname
                };
                return done(null, user);
            }
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    connection.query(`SELECT * FROM \`users\` WHERE \`id\` = ${id}`, (err, results) => {
        if (err) return console.error(err);
        const user = {
            id: results[0].id,
            type: results[0].type,
            fullname: results[0].fullname
        };
        done(null, user);
    });
});