const db = require("./database");

function transaction(sqls, params) {
    return new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
            if (sqls.length !== params.length) {
                connection.release();
                return reject(new Error("database_transaction: sql and param don't match"));
            }
            // execute transaction
            connection.beginTransaction((beginErr) => {
                if (beginErr) {
                    connection.release();
                    return reject(beginErr);
                }
                // console.log("database_transaction: executing " + sqls.length + " SQLs");
                // return promise array
                let promises = sqls.map((sql, index) => {
                    return new Promise((sqlResolve, sqlReject) => {
                        const data = params[index];
                        connection.query(sql, data, (err, result) => {
                            if (err) {
                                return sqlReject(err);
                            }
                            sqlResolve(result);
                        });
                    });
                });
                // check all promises resolved
                Promise.all(promises)
                    .then((results) => {
                        // commit transaction
                        connection.commit(function (err, info) {
                            if (err) {
                                console.log("database_transaction: commit failed" + err);
                                connection.rollback(function (err) {
                                    if (err) console.log("database_transaction: rollback failed" + err);
                                    connection.release();
                                });
                                return reject(err);
                            }
                            connection.release();
                            resolve(results);
                        });
                    })
                    .catch((err) => {
                        connection.rollback(function () {
                            console.log("database_transaction: has error " + err);
                            connection.release();
                            reject(err);
                        });
                    });
            });
        });
    });
}

module.exports = {
    transaction
};