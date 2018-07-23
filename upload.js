const mongoose = require('mongoose');
const Voucher = require('./voucher');
const through2 = require('through2')
const fs = require('fs')
const csv = require('csv-stream')
const chunksCount = 100;
let maxId = 0;
exports.post = function (req, res) {
	if (!req.files)
	  return res.status(400).send('No files were uploaded.');
	const voucherFile = req.files.file;
	let vouchers = [];
	
	/**
	* Get max id.
	*/
	Voucher.find({}, null, {sort: {'id': -1}, limit: 1}, (err, voucher) => {
      if(err)
        res.send(err);
	  if(voucher)
		 maxId = voucher[0].id;
	  startStreaming()
    });
	
    /**
	* Parsing  of csv file.
	*/
	let startStreaming = () => {
	const stream = fs.createReadStream('datta.csv')
	  .pipe(csv.createStream({
		  endLine : '\n',
		  columns : ['coupan'],//['id', 'coupan', 'openid', 'assignedDateTime', 'lastAccessedDateTime', 'isAssigned', 'isUsed'],
		  escapeChar : '"',
		  enclosedChar : '"'
	  }))
	  .pipe(through2({ objectMode: true }, (row, enc, cb) => {
		  maxId = maxId+1;
		  let voucher = {
			  _id: new mongoose.Types.ObjectId(),
			  id: maxId,
			  coupan: row.coupan,
			  openid: '',
			  assignedDateTime: '',
			  lastAccessedDateTime: '',
			  isAssigned: false,
			  isUsed: false
		  };
		  
		  vouchers.push(voucher);
		  if(vouchers.length === chunksCount){
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
		//console.log('saved a row')
	  })
	  .on('end', () => {
		console.log('end')
		res.status(200).send('vouchers have been successfully uploaded.');
	  })
	  .on('error', err => {
		console.error(err)
	  })
    }
	
	/**
	* Upload data in database.
	* Bulk upload.
	*/
	const saveIntoDatabase = vouchers => {
	  return new Promise((resolve, reject) => {
		  Voucher.create(vouchers, function(err, documents) {
			if (err) throw err;
			console.log(vouchers.length + ' vouchers have been successfully uploaded.');
			resolve()
		  });
	  })
	}
};