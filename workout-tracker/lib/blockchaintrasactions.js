
var rest = require('restler');


/**
 * Allows Refund or Rewards back to user
 * @param {string=} url the url of the Refund server
 * @param {Network=} network whether to use livenet (MainNet) or testnet
 * @constructor
 */
function MerchantUserReviews() {
	return this;
}

MerchantUserReviews.prototype.getUserReviewsByMerchant = function(merchantAddress, fromDate, toDate, callback){
	
	if (!merchantAddress || !fromDate || !toDate){
		throw new Error('Some or All Input Parameters are missing. Parameters required are merchantAddress, fromDate, toDate' );
	}
	
	// find all transactions that merhcnat got
	var url = 'http://api.blockcypher.com/v1/btc/test3/addrs/';
	var transBlockChianUrl = 'https://api.blockcypher.com/v1/btc/test3/txs/';

	var addressMap = {};
	
	// get List of Transactions
	rest.get(url+merchantAddress).on('complete', function(data) {
		for(var i = 0; i < data.txrefs.length; i++)  {
			if (data.txrefs[i].tx_input_n < 0 ){
					var paymentFromAddress;
					transUrl = transBlockChianUrl + data.txrefs[i].tx_hash;
					rest.get(transUrl).on('complete', function(data2) {
					//	console.log('		 Data Input 	');
						
						console.log('	 Data Output in Merchat	');
						for(var j = 0; j < data2.outputs.length; j++) {
							var script = data2.outputs[j].script;
							var script_type = data2.outputs[j].script_type;
							if (script_type === "null-data"){
								console.log("script inside......---->"+script);
								
									var hex = script.toString();//force conversion
									var str = '';
									for (var i = 0; i < hex.length; i += 2)
									str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
									console.log("converted script---->"+str);
								
							}
						}
						return callback(null,addressMap);
					})
			}
		}
	});
}


MerchantUserReviews.prototype.getUserReviewByTransaction = function(txid, callback){
	
	console.log("calling getUserReviewByTransaction---->");
	
	
	if (!txid){
		throw new Error('Some or All Input Parameters are missing. Parameters required are merchantAddress, fromDate, toDate' );
	}
	
	// find transaction by ID
	var transBlockChianUrl = 'https://api.blockcypher.com/v1/btc/test3/txs/';

	var addressMap = {};
	
	// get List of Transactions
	rest.get(transBlockChianUrl+txid).on('complete', function(data) {
		var paymentFromAddress;
		transUrl = transBlockChianUrl + txid;
		rest.get(transUrl).on('complete', function(data2) {
			console.log('	 Data Output 	');
			for(var j = 0; j < data2.outputs.length; j++) {
				var script = data2.outputs[j].script;
				var script_type = data2.outputs[j].script_type;
				console.log("script_type---->"+script_type);
				if (script_type === "null-data"){
					var buffer = new Buffer(script);
					console.log("script inside......---->"+script);
				    var hex = script.toString();//force conversion
					var str = '';
					for (var i = 4; i < hex.length; i += 2)
					str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
					console.log("converted script---->"+str);
					callback(null,str);	
				}
			}
			
		})
	});
}





module.exports = MerchantUserReviews;

 