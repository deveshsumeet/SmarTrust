'use strict';

var bitcore = require('bitcore');

var $ = bitcore.util.preconditions;
var Address = bitcore.Address;
var JSUtil = bitcore.util.js;
var Networks = bitcore.Networks;
var Transaction = bitcore.Transaction;
var UnspentOutput = Transaction.UnspentOutput;
var Unit = bitcore.Unit;
var Insight = require('bitcore-explorers').Insight;
var UnspentOutput = Transaction.UnspentOutput;
var Script = bitcore.Script;

/**
 * Allows Refund or Rewards back to user
 * @param {string=} url the url of the Refund server
 * @param {Network=} network whether to use livenet (MainNet) or testnet
 * @constructor
 */
function Review(url, network) {
  if (!url && !network) {
    return new Refund(Networks.defaultNetwork);
  }
  if (Networks.get(url)) {
    network = Networks.get(url);
    if (network === Networks.livenet) {
      url = 'https://insight.bitpay.com';
    } else {
      url = 'https://test-insight.bitpay.com';
    }
  }
  JSUtil.defineImmutable(this, {
    url: url,
    network: Networks.get(network) || Networks.defaultNetwork
  });
  
  return this;
}

Review.prototype.postReview = function(fromAddress, toAddress, fromPrivateKey, rating, postReviewData, callback){
	if (!fromAddress || !toAddress || !fromPrivateKey || !postReviewData){
		throw new Error('Some or All Input Parameters are missing. Parameters required are merchantAddress, userAddress, amount, merchantPrivateKey' );
	}
	
	var insight = new Insight(this.url, this.network);

	insight.getUnspentUtxos(fromAddress, function(err, utxos) {
	console.log("---------------------------------- about to get  utxos ------------" );
		if (err) {
			throw new Error('Refund unsuccessfull. Issue fetching Unspent Merchant data from Address. ' + err);
		} else {
			console.log("utxos: " + utxos );
			var txnID;
			var amt;
			var toAmt;
			var txnObj;
			var amtInSatoshis;
			var scriptPubKey;
			var oIndex;
			
			var blockChaindata = '{"review":'+rating+',"rating":'+postReviewData+'}';
			
			for(var i = 0; i < utxos.length; i++)  {
				txnObj = utxos[i].toObject();
				txnID = utxos[i].toObject().txid;
				amt = utxos[i].toObject().amount;
				amtInSatoshis = Unit.fromBTC(amt).satoshis;
				
				console.log("Individual Txn: " + txnID);
				console.log("Individual amt: " + amtInSatoshis);
				console.log("Individual index: " + utxos[i].toObject().vout);
				console.log("Script Pub key-->"+utxos[i].toObject().scriptPubKey);
				toAmt = amtInSatoshis - 1000;
				oIndex = utxos[i].toObject().vout;
				console.log("Individual toAmt: " + toAmt);
			}
			
			
			var simpleUtxoWith100000Satoshis = {
				address: fromAddress,
				txId: txnID,
				outputIndex: oIndex,
				//scriptPubKey: scriptHash,
				script: Script.buildPublicKeyHashOut(fromAddress).toString(),
				satoshis: amtInSatoshis
			};
			
			var transaction = new Transaction()
						    .from(simpleUtxoWith100000Satoshis)
							.to(toAddress, toAmt)
							.addData(blockChaindata)
							.change(fromAddress)
							.sign(fromPrivateKey)
			
			console.log("transaction created: " + transaction);
			
			

			insight.broadcast(transaction.serialize(), function(err, returnedTxId) {
				console.log("---------------------------------- about to send transaction ------------" );
				if (err) {
					console.log("err" + err );
					return err;
				} else {
					console.log("returnedTxId: " + returnedTxId );
					callback(err, returnedTxId);
				}
			});
		
		
		}
		
		
	});
}

module.exports = Review;









