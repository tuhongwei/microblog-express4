var express = require('express');
var app = express();
var router = express.Router();
var check = require('../check/check');
var Post = require('../models/post');

router.post('',check.checkLogin);
router.post('',function(req,res,next){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name,req.body.blog);
	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}else{
			req.flash('success','发表成功');
			res.redirect('/users/'+ currentUser.name);
		}
	});
});

module.exports = router;