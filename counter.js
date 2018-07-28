const mongoose = require('mongoose');
const coupons = require('./voucher');

/**
*  To get the count of total coupons and assigned coupons.
*/
exports.get = function (req, res) {
	Promise.all([
	  coupons.count({}),
	  coupons.count({ isAssigned: 'TRUE'})
	]).then( ([ totalCoupons, assignedCoupons ]) => {
	  res.status(200).json({total: totalCoupons, assigned: assignedCoupons});
    });
};

/**
*  To get the count of total coupons.
*/
exports.totalCoupans = function(req, res){
	coupons.count({}, (error, count) => {
		if(err){
			res.status(500).send(err);
		}

		res.status.json({'total_coupons': count});
	})
}

/**
*  To get the count of assigned coupons.
*/
exports.assignedCoupans = function(req, res){
	coupons.count({ isAssigned: 'TRUE'}, (error, count) => {
		if(err){
			res.status(500).send(err);
		}

		res.status.json({'total_assigned_coupons': count});
	})
}


exports.another = function(req, res){
	
// 	coupons.aggregate([
//     {
//         "$group": {
//             "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$assignedDateTime" } },
//             "total": { "$sum": 1 },
//             "active_count": {
//                 "$sum": {
//                     "$cond": [ { "$eq": [ "$isAssigned", 'TRUE' ] }, 1, 0 ]
//                 }
//             },
//             "inactive_count": {
//                 "$sum": {
//                     "$cond": [ { "$eq": [ "$isAssigned", "FALSE" ] }, 1, 0 ]
//                 }
//             }
//         }
//     },
//     { "$sort": { "_id": 1 } }
// ], (err, result) => {
// 	if(err)
//         res.send(err);
// 	  if(result)
// 		 console.log('-----count------',result)
// })
}