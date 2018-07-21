var json2csv = require('json2csv');

exports.get = function(req, res) {

	//var fields = Object.keys(Voucher.schema.obj);
	var fields = [
		'id',
		'coupan',
		'openid',
		'assignedDateTime',
		'lastAcessedDateTime',
		'isAssigned',
		'isUsed'
	];

	var csv = json2csv({ data: '', fields: fields });

	res.set("Content-Disposition", "attachment;filename=vouchers.csv");
	res.set("Content-Type", "application/octet-stream");

	res.send(csv);

};