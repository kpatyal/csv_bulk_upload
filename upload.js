const mongoose = require('mongoose');
const Voucher = require('./voucher');
const through2 = require('through2')
const fs = require('fs')
const csv = require('csv-stream')
const chunksCount = 100;

exports.post = function (req, res) {
	if (!req.
		files)
		return res.status(400).send('No files were uploaded.');
	const voucherFile = req.files.file;
    //console.log('voucherFile-------->',voucherFile)
	let vouchers = [];
	const stream = fs.createReadStream('datta.csv')
	  .pipe(csv.createStream({
		  endLine : '\n',
		  //columns : ['id', 'coupan', 'openid', 'assignedDateTime', 'lastAccessedDateTime', 'isAssigned', 'isUsed'],
		  escapeChar : '"',
		  enclosedChar : '"'
	  }))
	  .pipe(through2({ objectMode: true }, (row, enc, cb) => {
		 
		  row['_id'] = new mongoose.Types.ObjectId()
		  //console.log('new row', row);
		  vouchers.push(row);
		  //console.log('length', vouchers.length);
		if(vouchers.length === chunksCount){
			//console.log('Condition matched-----------', vouchers[0]);
			saveIntoDatabase(vouchers).then(() => {
			  vouchers=[];
		      cb(null, true)
			})
			.catch(err => {
			  cb(err, null)
			})
		}else{
			cb(null, true)
		}
		
	  }))
	  .on('data', data => {
		console.log('saved a row')
	  })
	  .on('end', () => {
		console.log('end')
		res.status(200).send('vouchers have been successfully uploaded.');
	  })
	  .on('error', err => {
		console.error(err)
	  })

	const saveIntoDatabase = vouchers => {
	  //console.log('chunks----->', vouchers)
	  return new Promise((resolve, reject) => {
		  Voucher.create(vouchers, function(err, documents) {
			if (err) throw err;
			console.log(vouchers.length + ' vouchers have been successfully uploaded.');
			resolve()
		  });
	  })
	}
	};