var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var check = require('../check/check');


router.get('',check.checkNotLogin);
router.get('',function(req,res,next){
	res.render('reg',{
		title: '用户注册'
	});
});
router.post('',check.checkNotLogin);
router.post('',function(req,res,next){
	console.log(req.body, 111)
	if(req.body['password-repeat']!=req.body['password']){
		req.flash('error','两次输入的口令不一致');
		return res.redirect('/reg');
	}else{
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var newUser = new User({
			name: req.body.username,
			password: password
		});
		//检查用户名是否已经存在
		User.get(newUser.name,function(err,user){
			if(user){
				err = 'username already exits.';
			}
			console.log('error', err)
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}
			//如果不存在则新增用户
			newUser.save(function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});
		});
	}
});

module.exports = router;