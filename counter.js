const mongoose = require('mongoose');
const coupons = require('./voucher');
const fs = require('fs')
/**
*  To get the count of total coupons and assigned coupons.
*/
exports.get = function (req, res) {
	Promise.all([
	  coupons.count({}),
	  coupons.count({ isAssigned: false})
	]).then( ([ totalCoupons, assignedCoupons ]) => {
	  res.status(200).json({total: totalCoupons, assigned: assignedCoupons});
    });
};

/**
*  To get the count of total coupons.
*/
exports.totalCoupans = function(req, res){
	coupons.count({}, (error, count) => {
		if(error){
			res.status(500).send(error);
		}

		res.status(200).send({'total_coupons': count});
	})
}

/**
*  To get the count of assigned coupons.
*/
exports.assignedCoupans = function(req, res){
	coupons.count({isAssigned: true}, (error, count) => {
		if(error){
			res.status(500).send(error);
		}

		res.status(200).send({'total_assigned_coupons': count});
	})
}


exports.duplicate = function(req, res){

	coupons.aggregate(
		[{ $group: {
		      _id: { coupon: "$coupon" },   // replace `name` here twice
		      uniqueIds: { $addToSet: "$_id" },
		      count: { $sum: 1 } 
		    } }, 
            { $match: { 
               count: { $gte: 2 } 
            } },
            { $sort : { count : -1} },
        ]).exec(function(err, result){
        	console.log('err----', err);
        	console.log('result=====', result);
        });
}