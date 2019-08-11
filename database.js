var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 33545);

app.use(express.static(__dirname + '/public'));

// Homepage
app.get('/', function(req, res, next){
	var context = {};

	mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
	
	if(err){
		next(err);
		return;
	}
	
	context.results = JSON.stringify(rows);
	res.render('home', context);
	
	});
});

app.post('/', function(req, res, next){
	res.render("edit-table");
});

// View whole table with get
app.get('/get-table', function(req, res, next){
  	console.log("in get-table");

	var context = {};
 
	mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    		if(err){
      			next(err);
      			return;
    		}

    		res.type("application/json");
    		res.send(rows);
  	});
});

// 

// Reset table with variables from Assignment
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
    "date DATE," +	
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.post('/insert',function(req,res,next){
  	console.log("in insert");
	var context = {};
 
	mysql.pool.query("INSERT INTO todo (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){

	if(err){
      		next(err);
      		return;
    	}
	
	else{	
		mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    			if(err){
      				next(err);
      				return;
    			}
			console.log(JSON.stringify(rows));    	

    			res.type("application/json");
    			res.send(rows);
  		})
	};
  	});
});

app.get('/insert', function(req, res, next){
  	console.log("in insert get");
	var context = {};
 
	mysql.pool.query("INSERT INTO todo (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){

	if(err){
      		next(err);
      		return;
    	}
	
	else{	
		mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    			if(err){
      				next(err);
      				return;
    			}
			console.log(JSON.stringify(rows));    	

    			res.type("application/json");
    			res.send(rows);
  		})
	}
	});
});

app.post('/delete',function(req,res,next){
 	console.log("in delete");
	 var context = {};

  	mysql.pool.query("DELETE FROM todo WHERE id=?", [req.body.id], function(err, result){
	if(err){
      		next(err);
      		return;
    	}
	
	else{	
		mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    			if(err){
      				next(err);
      				return;
    			}
			console.log(JSON.stringify(rows));    	
    			res.type("application/json");
    			res.send(rows);
  		})
	}
  });
});

app.post('/edit', function(req, res, next){

	console.log('in edit');

	var context = {};

	mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.body.id], function(err, rows, fields){

		if(err){
			next(err);
			return;
		}

		else{
			res.type("application/json");
			res.send(rows);
		}
	})
});


///safe-update?id=1&name=The+Task&done=false
app.post('/update',function(req,res,next){
	console.log("In update");
  var context = {};
  mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, reps=?, weight=? date=? lbs=? WHERE id=?",
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.body.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
	else{	
		mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    			if(err){
      				next(err);
      				return;
    			}
			console.log("update " + JSON.stringify(rows));    	

    			res.type("application/json");
    			res.send(rows);
  		})
	}
      });
    }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});


/*
///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.get('/simple-update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE todo SET name=?, reps=?, weight=? date=? unit=? WHERE id=? ",
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.render('home',context);
  });
});
*/
