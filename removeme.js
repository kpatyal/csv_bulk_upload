const mongoose = require('mongoose');
const coupons = require('./voucher');
const through2 = require('through2')
const fs = require('fs')
const csv = require('csv-stream')
const chunksCount = 500;
let maxId = 0;
exports.post = function (req, res) {
	let vouchers = [];
    /**
	* Parsing  of csv file.
	*/
	let startStreaming = () => {
	const stream = fs.createReadStream('final/fifth/5.csv')
	  .pipe(csv.createStream({
		  endLine : '\n',
		  columns : ['coupon','id'],//['id', 'coupan', 'openid', 'assignedDateTime', 'lastAccessedDateTime', 'isAssigned', 'isUsed'],
		  escapeChar : '"',
		  enclosedChar : '"'
	  }))
	  .pipe(through2({ objectMode: true }, (row, enc, cb) => {
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
		    vouchers.push(row.coupon);
		    if(vouchers.length === chunksCount){
				removeFromDatabase(vouchers).then(() => {
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
		if(vouchers.length > 0){
			removeFromDatabase(vouchers).then(() => {
			  vouchers=[];
		      cb(null, true)
			})
			.catch(err => {
			  cb(err, null)
			})
		}
		res.status(200).send('vouchers have been removed successfully.');
	  })
	  .on('error', err => {
		console.error(err)
	  })
    }

    startStreaming()

	/**
	* Remove data from database.
	* Bulk Delete.
	*/
	const removeFromDatabase = vouchers => {
	  return new Promise((resolve, reject) => {
		  coupons.remove({id: {$in: vouchers}}, function(err, documents) {
			if (err) throw err;
			//console.log();
			console.log(vouchers.length, 'vouchers have been removed successfully.');
			resolve()
		  });
	  })
	}
};