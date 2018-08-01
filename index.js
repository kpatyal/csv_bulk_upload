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
var db = mongoose.connect();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var template = require('./template.js');
app.get('/template', template.get);

var upload = require('./upload.js');
app.get('/upload', upload.post);

var splitFile = require('./split.js');
app.get('/split', splitFile.get);


var counter  = require('./counter.js');
app.get('/count', counter.get);
app.get('/totalCoupans', counter.totalCoupans);
app.get('/assignedCoupans', counter.assignedCoupans);

app.get('/duplicate', counter.duplicate);


var create = require('./create.js');
app.get('/create', create.post);

var removeme = require('./removeme.js');
app.get('/removeme', removeme.post);





