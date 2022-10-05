const {createPool} = require('mysql');

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});

// pool.connect((err)=> {
//     if(!err)
//     console.log('DB Connection Established!!');
//     else
//     console.log('DB Connection failed \n Error' + JSON.stringify(err, undefined, 2));
// });


module.exports = pool;
