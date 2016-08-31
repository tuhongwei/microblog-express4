var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var check = require('../check/check');


router.get('',check.checkLogin);
router.get('',function(req,res,next){
	req.session.user = null;
	req.flash('sucess','登出成功');
	res.redirect('/');
});

module.exports = router;