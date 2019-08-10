var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_castanap',
  password        : 'wtwwmMhBLCT7i6h',
  database        : 'cs290_castanap'
});

module.exports.pool = pool;
