var express = require('express');
var app = express();
var  users = {
	byvoid:{
		name: 'Carbo',
		website: 'http://www.byvoid.com'
	},
	Twittytop:{
		name: 'Tuhongwei',
		website: 'http://www.tuhongwei.com'
	}
};
app.all('/users/:username',function(req,res,next){
	if(users[req.params.username]){
		next();
	}else{
		next(new Error(req.params.username+ 'does not exits.'));
	}
});
app.get('/users/:username',function(req,res,next){
	res.send(JSON.stringify(users[req.params.username]));
});
app.put('/users/:username',function(req,res,next){
	res.send('Done.');
});
app.listen(2000);