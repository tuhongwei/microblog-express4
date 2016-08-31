var mongodb = require('./db');

function Post(username,blog,time){
	this.user = username;
	this.blog = blog;
	this.time = time?time:new Date();
}
module.exports = Post;


Post.prototype.save = function(callback){
	var post = {
		user: this.user,
		blog: this.blog,
		time: this.time
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}else{
			db.collection('posts',function(err,collection){
				if(err){
					mongodb.close();
					return callback(err);
				}else{
					collection.ensureIndex('user');
					collection.insert(post,{safe:true},function(err,post){
						mongodb.close();
						callback(err,post);
					});
				}
			});
		}
	});
};
Post.get = function(username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}else{
			db.collection('posts',function(err,collection){
				if(err){
					mongodb.close();
					return callback(err);
				}else{
					var query = {};
					if(username){
						query.user = username;
					}
					collection.find(query).sort({time:-1}).toArray(function(err,docs){
						mongodb.close();
						if(err){
							callback(err,null)
						}else{
							var posts = [];
							docs.forEach(function(doc,index){
								var post = new Post(doc.user,doc.blog,doc.time);
								posts.push(post);
							});
							callback(null,posts);
						}
					});
				}
			});
		}
	});
};

