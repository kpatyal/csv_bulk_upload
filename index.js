var app = require('express')();
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
// var mongojs = require('mongojs')

var server = require('http').Server(app);

app.use(fileUpload());

server.listen(8088);


// var connectionString = mongoUriBuilder({
// 	username: encodeURIComponent('user$$$$'),
// 	password: encodeURIComponent('pass$$$$'),
// 	host: 'demodemo',
// 	port: 1111,
// 	replicas: [
// 		{host: 'host2', port: 2222},
// 		{host: 'host3', port: 3333}
// 	],
// 	database: 'db',
// 	options: {
// 		w: 0,
// 		readPreference: 'secondary'
// 	}
// });
// demodemo:mmjnRIMPrrKlWQg3qEbgb9YiXTkn5MX73x2jlogDdRosPXWbb2bxU92CGWfkCcN4ZSFx2jmx3jpnzhngg1Zz8Q%3D%3D@demodemo.documents.azure.com:10255/demodemo?ssl=true', ['vouchers']

//var db= mongoose.connect('mongodb://demodemo:mmjnRIMPrrKlWQg3qEbgb9YiXTkn5MX73x2jlogDdRosPXWbb2bxU92CGWfkCcN4ZSFx2jmx3jpnzhngg1Zz8Q==@demodemo.documents.azure.com:10255/demodemo?ssl=true&replicaSet=globaldb');
var db= mongoose.connect('mongodb://paypal-merlinentertainments-db:DJPGLr8Kxi1fGfTd8SVo3ADuBvbOedANHP07EOIaNSIfdeYflzVbgXMIRu15IrI7fSyuymf25CJG1rGmpOOZBA%3D53D@paypal-merlinentertainments-db.documents.azure.com:10255/paypalcoupansdb?ssl=true&replicaSet=globaldb');
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var template = require('./template.js');
app.get('/template', template.get);

var upload = require('./upload.js');
app.post('/', upload.post);

var splitFile = require('./split.js');
app.get('/split', splitFile.get);

