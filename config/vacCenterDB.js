const mysql = require('mysql')

var connection  = mysql.createPool({
    host:'localhost',
    user:'root',
    password:"zemark1412",
    database:"vaccenter"
});

module.exports = connection