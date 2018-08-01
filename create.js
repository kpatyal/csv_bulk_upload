const mongoose = require('mongoose');
const coupons = require('./voucher');
const through2 = require('through2')
const fs = require('fs')
const csv = require('csv-stream')
const chunksCount = 10000;
let maxId = 6900000;
var csvWriter = require('csv-write-stream')
exports.post = function (req, res) {
	let vouchers = [];
    var writer = csvWriter({ headers: ["coupan", "id"]})
    writer.pipe(fs.createWriteStream('final/seven/7m-9.csv'))
	
    /**
	* Parsing  of csv file.
	*/
	let startStreaming = () => {
	const stream = fs.createReadStream('des/seven/7m-9.csv')
	  .pipe(csv.createStream({
		  endLine : '\n',
		  columns : ['coupan'],//['id', 'coupan', 'openid', 'assignedDateTime', 'lastAccessedDateTime', 'isAssigned', 'isUsed'],
		  escapeChar : '"',
		  enclosedChar : '"'
	  }))
	  .pipe(through2({ objectMode: true }, (row, enc, cb) => {
		  maxId = maxId+1;		  
		  writer.write({coupan: row.coupan, id: maxId})
		  cb(null, true)
		
	  }))
	  .on('data', data => {
		//console.log('saved a row')
	  })
	  .on('end', () => {
		writer.end()
		res.status(200).send('vouchers have been successfully uploaded.');
	  })
	  .on('error', err => {
		console.error(err)
	  })
    }

	startStreaming()
};