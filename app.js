var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

/*var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    findDocuments(db, function() {
      db.close();
    });
  });
});
*/

var fs = require('fs');
var accessLogFile = fs.createWriteStream('accessLog',{flags:'a'});
var errorLogFile = fs.createWriteStream('errorLog',{flags:'a'});
//app.use(logger('dev'));
//app.use(logger({stream:accessLogFile}));
app.use('production',function(){
	app.error(function(err,req,res,next){
		var meta = '[' + new Date + ']' + req.url +'\n';
		errorLogFile.write(meta + err.stack + '\n');
		next();
	});
})

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

var routes = require('./routes/index');
var users = require('./routes/users');
var reg = require('./routes/reg');
var login = require('./routes/login');
var loginout = require('./routes/loginout');
var post = require('./routes/post');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var partials = require('express-partials');
app.use(partials());

var flash = require('connect-flash');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: settings.cookieSecret,
  resave: false,
  saveUninitialized: true,
	store: new MongoStore({
		db: settings.db,
		url: settings.url
	})
}));
app.use(express.static(path.join(__dirname, 'public')));

////动态视图
app.use(function(req,res,next){
	res.locals.user = req.session.user;
	var err = req.flash('error');
	res.locals.error = err.length?err:null;
	var succ = req.flash('success');
	res.locals.success = succ.length?succ:null;
	next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/reg',reg);
app.use('/login',login);
app.use('/loginout',loginout);
app.use('/post',post);
app.get('/list',function(req,res){
	res.render('list',{
		title: 'List',
		items: [1991,"byvoid","Node.js"]
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
// console.log(process.env.PORT);
