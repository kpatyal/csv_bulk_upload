const csvSplitStream = require('csv-split-stream');
const fs = require('fs');
exports.get = function (req, res) {
	csvSplitStream.split(
	  fs.createReadStream('original/7m.csv'),
	  {
		lineLimit: 100000
	  },
	  (index) => fs.createWriteStream(`des/seven/7m-${index}.csv`)
	)
	.then(csvSplitResponse => {
	  console.log('csvSplitStream succeeded.', csvSplitResponse);
	  res.status(200).send(csvSplitResponse.totalChunks+ ' new files created');
	  // outputs: {
	  //  "totalChunks": 350,
	  //  "options": {
	  //    "delimiter": "\n",
	  //    "lineLimit": "10000"
	  //  }
	  // }
	}).catch(csvSplitError => {
	  console.log('csvSplitStream failed!', csvSplitError);
	});
 
};