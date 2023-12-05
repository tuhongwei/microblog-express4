var mongoClient = require('./mongoClient');
var settings = require('../settings');
function User(user){
	this.name = user.name;
	this.password = user.password;
}
module.exports = User;

User.prototype.save = function(callback){
	var newUser = {
		name: this.name,
		password: this.password
	};
	mongoClient.connect(async function(err,client){
		if(err){
			return callback(err);
		}
		const db = client.db(settings.db)
		try {
			const collection = await db.collection('users')
			//为name属性添加索引
			await collection.createIndex('name',{unique: true});
			const user = await collection.insertOne(newUser,{safe: true})
			callback(null,user);
		} catch (err) {
			mongoClient.close();
			return callback(err);
		}
	});
};

User.get = function(username,callback){
	mongoClient.connect(async function(err,client){
		if(err){
			return callback(err);
		}
		const db = client.db(settings.db)
		try {
			const collection = await db.collection('users')
			const doc = await collection.findOne({name: username})
			if(doc){
				var user = new User(doc);
				callback(null,user);
			}else{
				callback(err,null);
			}
		} catch (err) {
			mongoClient.close();
			return callback(err);
		}
	});	
};