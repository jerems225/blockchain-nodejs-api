const mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'api_storage',
    user     : 'root',
    password : '',
});
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});

// connection.query('SELECT * FROM user', function (error, results, fields) {
//     if (error)
//         throw error;

//     results.forEach(result => {
//         console.log(result.email);
//     });
// });

connection.end();
