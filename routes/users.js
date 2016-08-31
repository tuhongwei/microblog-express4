var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  User.get(req.params.username,function(err,user){
	if(!user){
		req.flash('error','用户不存在');
		return res.redirect('/');
	}else{
		Post.get(req.params.username,function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}else{
				res.render('user',{
					title: user.name,
					posts: posts
				});
			}
		});
	}
  });
});

module.exports = router;
