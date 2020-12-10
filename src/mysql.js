const mysql = require("mysql2");

/**
 * Loading settings
 */
// TODO: Try make easier
try {
    settings = require('../settings.json');
} catch (e) {
    settings = process.env;
}

/**
 * Creating pool with max connections 5
 */
const pool = mysql.createPool({
    connectionLimit: 5,
    host: settings.mysql_host,
    database: settings.mysql_database,
    user: settings.mysql_user,
    password: settings.mysql_password
});

/**
 * Making external query
 */
module.exports.query = (str, callback) => {
    pool.query(str, callback);
};