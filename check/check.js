var express = require('express');
var app = express();
//var flash = require('connect-flash');
//app.use(flash());

function Check(){}
module.exports = Check;

Check.checkLogin = function(req,res,next){
		if(!req.session.user){
			req.flash('error','未登入');
			return res.redirect('/login');
		}else{
			next();
		}
	};
Check.checkNotLogin = function(req,res,next){
	if(req.session.user){
		req.flash('error','已登入');
		return res.redirect('/');
	}else{
		next();
	}
};