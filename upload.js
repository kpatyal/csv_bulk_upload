const mongoose = require('mongoose');
const coupons = require('./voucher');
const through2 = require('through2')
const fs = require('fs')
const csv = require('csv-stream')
const chunksCount = 5000;
let maxId = 0;
exports.post = function (req, res) {
	let vouchers = [];

	
	/**
	* Get max id.
	*/
	
	/*coupons.find({}, null, {sort: {'id': -1}, limit: 1}, (err, voucher) => {
		console.log('enter-----', err, '----', voucher);
      if(err)
        res.send(err);
	  if(voucher && voucher.length>0)
		 maxId = voucher[0].id;
	  startStreaming()
    });*/
	
    /**
	* Parsing  of csv file. des/second/2m-1.csv. ///
	*/
	let startStreaming = () => {
	const stream = fs.createReadStream('final/seven/7m-9.csv')
	  .pipe(csv.createStream({
		  endLine : '\n',
		  columns : ['coupon','id'],//['id', 'coupan', 'openid', 'assignedDateTime', 'lastAccessedDateTime', 'isAssigned', 'isUsed'],
		  escapeChar : '"',
		  enclosedChar : '"'
	  }))
	  .pipe(through2({ objectMode: true }, (row, enc, cb) => {
		  //maxId = maxId+1;
		  let voucher = {
			  _id: new mongoose.Types.ObjectId(),
			  id: row.id,
			  coupon: row.coupon,
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
		console.log('end',vouchers.length)
		if(vouchers.length > 0){
			saveIntoDatabase(vouchers).then(() => {
			  vouchers=[];
		      cb(null, true)
			})
			.catch(err => {
			  cb(err, null)
			})
		}
		res.status(200).send('vouchers have been successfully uploaded.');
	  })
	  .on('error', err => {
		console.error(err)
	  })
    }

    //startStreaming()

	/**
	* Upload data in database.
	* Bulk upload.
	*/
	const saveIntoDatabase = vouchers => {
	  return new Promise((resolve, reject) => {
		  coupons.create(vouchers, function(err, documents) {
			if (err) throw err;
			console.log(vouchers.length + ' vouchers have been successfully uploaded.');
			resolve()
		  });
	  })
	}
};