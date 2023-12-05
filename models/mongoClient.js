var settings = require('../settings');
const { MongoClient } = require('mongodb');
module.exports = new MongoClient(settings.url);