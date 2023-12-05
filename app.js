var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var partials = require('express-partials');
require('./mongo');
var settings = require('./settings');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var regRouter = require('./routes/reg');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var postRouter = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(partials());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: settings.cookieSecret,
  resave: false,
  saveUninitialized: true,
	store: MongoStore.create({
		dbName: settings.db,
		mongoUrl: 'mongodb://localhost/microblog'
	})
}));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

////动态视图
app.use(function(req,res,next){
	res.locals.user = req.session.user;
	var err = req.flash('error');
	res.locals.error = err.length ? err: null;
	var succ = req.flash('success');
	res.locals.success = succ.length ? succ: null;
	next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reg', regRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/post', postRouter);
app.get('/list', function(req,res){
	res.render('list',{
		title: 'List',
		items: [1991,"byvoid","Node.js"]
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
