

module.exports = function() {
  var mysql      = require('mysql')

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'eshell4274',
    database : 'o2'
  })
  connection.connect();
  return connection
}
