const pool = require("../../config/db");

module.exports ={
    create: (data, callBack) => {
        pool.query(
            `insert into Persons (id, LastName, FirstName, Email, Password, account_created) values (?, ?, ?, ?, ?, NOW())`,
            [
                data.id,
                data.LastName,
                data.FirstName,
                data.Email,
                data.Password

            ],
            (err, results, fields) => {
                if(err) {
                 return callBack(err)
                }
                return callBack(null, results);
            }
            );
            console.log(data);
    },
    getUser: callback => {
        pool.query(
            `select id, LastName, FirstName, Email, account_created, account_updated  from Persons`,
            [],
            (err, results, fields) => {
                if(err) {
                  return  callback(err);
                }
                return callback(null, results);
            }
        )
    },
    getUserByUserID: (id, callback) => {
        pool.query(
            `select id, LastName, FirstName, Email, Password from Persons where id = ?`,
            [id],
            (err, results, fields) => {
                if(err) {
                    callback(err);
                }
                return callback(null,results);
            }           
        );
    },
    updateUser: (data, callback) => {
        pool.query(
            `update Persons set LastName=?, FirstName=?, Password=?, account_updated=NOW() where id = ?`,
            [
                data.LastName,
                data.FirstName,
                data.Password,
            ],
            (err, results, fields) => {
                if(err) {
                    callback(err);
                }
                return callback(null,results);
            }         
        )
    },
    deleteUser: (data, callback) => {
        pool.query(
            `delete from Persons where id = ?`,
            [data.id],
            (err, results, fields) => {
                if(err) {
                    callback(err);
                }
                return callback(null,results);
            }         
        );
    }
};