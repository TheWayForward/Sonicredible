const SQL = require("../database/sql");
const Query = require("../database/database");

class UserDao {
    static async selectUser(id) {
        let sql = SQL.generateSQL(SQL.selectById({table_name: "user", id: id}));
        let result = await Query.query(sql.sql);
        console.log(result);
        return result;
    }
}

async function fun() {
    let result = await UserDao.selectUser(1);
    console.log(result);
}

fun();

