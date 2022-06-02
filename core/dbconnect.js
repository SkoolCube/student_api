const util = require('util');
const mysql = require('mysql');

const dbconnect = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'root',
    database: 'tapasya_db',
    port:'3306'
});

dbconnect.getConnection((err, connection) => {
    if(err) 
        console.error("NOT WORKING");
    
    if(connection)
        connection.release();
    return;
});

dbconnect.query = util.promisify(dbconnect.query);

module.exports = dbconnect;
