var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var check = require('../check/check');


router.get('',check.checkNotLogin);
router.get('',function(req,res,next){
	res.render('login',{
		title: '用户登入'
	});
});

router.post('',check.checkNotLogin);
router.post('',function(req,res,next){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	User.get(req.body.username,function(err,user){
		if(!user){
			req.flash('error','用户名不存在');
			return res.redirect('/login');
		}
		if(user.password!==password){
			req.flash('error','用户口令错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success','登入成功');
		res.redirect('/');
	});
});


module.exports = router;