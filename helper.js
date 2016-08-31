var express = require('express');
var app = express();
var path = require('path');
var util = require('util');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.inspect=function(obj){
		return util.inspect(obj,true,null,true);
	};
//app.locals.headers=function(req,res){
//		return req.headers;
//	};
app.use(function(req,res,next){
	res.locals.headers=req.headers;
	next();
});
app.get('/helper',function(req,res){
	res.render('helper',{
		title: "Helpers"
	});
});
app.listen(3000);