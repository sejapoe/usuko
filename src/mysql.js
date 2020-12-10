const mysql = require("mysql");

class Connection {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.mysql_host,
            database: process.env.mysql_database,
            user: process.env.mysql_user,
            password: process.env.mysql_password
        });

        this.connection.connect(() => {
            console.log(`[MYSQL] Successfully connected`);
        });
    }
};

module.exports = Connection;