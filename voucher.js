var mongoose = require('mongoose');
// var mongojs = require('mongojs')
// var db = mongojs('mongodb://localhost/csvimport', ['vouchers'])

var voucherSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	id: {
		type: Number,
		required: true
	},
	coupan: String,
	openid: String,
	assignedDateTime: String,
	lastAcessedDateTime: String,
	isAssigned: String,
	isUsed: String	
});

var Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;