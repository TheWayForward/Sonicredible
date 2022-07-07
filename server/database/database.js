const mysql = require("mysql");
const config = require("../config");

const db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

class Query {

    static query(sql, params) {
        return new Promise((resolve, reject) => {
            db.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    connection.query(sql, params, (err, result, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        connection.release();
                    })
                }
            })
        })
    }
}

module.exports = Query;