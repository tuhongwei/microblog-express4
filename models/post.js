var mongoClient = require('./mongoClient');
var settings = require('../settings');
function Post(username,blog,time){
	this.user = username;
	this.blog = blog;
	this.time = time?time:new Date();
}
module.exports = Post;


Post.prototype.save = function(callback){
	var newPost = {
		user: this.user,
		blog: this.blog,
		time: this.time
	};
	mongoClient.connect(async function(err,client){
		if(err){
			return callback(err);
		}else{
			const db = client.db(settings.db)
			try {
				const collection = await db.collection('posts')
				await collection.createIndex('user');
				const post = await collection.insertOne(newPost,{safe:true})
				callback(null,post);
			} catch (err) {
				mongoClient.close();
				return callback(err);
			}
		}
	});
};
Post.get = function(username,callback){
	mongoClient.connect(async function(err,client){
		if(err){
			return callback(err);
		}else{
			const db = client.db(settings.db)
			try {
				const collection = await db.collection('posts')
				var query = {};
				if(username){
					query.user = username;
				}
				collection.find(query).sort({time:-1}).toArray(function(err,docs){
					mongoClient.close();
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
			} catch (err) {
				mongoClient.close();
				return callback(err);
			}
		}
	});
};

