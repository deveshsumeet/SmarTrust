var bitcore = require('bitcore');
var merchantPrivatekeys = require('./../keys/MerchantPrivateKeys');
var merchantPublickeys = require('./../keys/MerchantPublicKeys');
var merchantAddresskeys = require('./../keys/merchantAddresskeys');
console.log('************ Instantiating refund *************');
var Review = require('./postReview.js');
console.log('************ Instantiated refund *************');
var PrivateKey = bitcore.PrivateKey;
var Networks = bitcore.Networks;

var ourAddress = merchantAddresskeys.merchant1;
var privateKey = merchantPrivatekeys.merchant1; 

var toAddress = merchantAddresskeys.merchant2;

console.log('************ ourAddress *************'+ourAddress);
console.log('************ privateKey *************'+privateKey);
console.log('************ toAddress *************'+toAddress);


var review = new Review('https://test-insight.bitpay.com', Networks.testnet);
var postReviewData = "First Review Posted from Generic Function";

console.log('************ ready to transmit *************'+postReviewData);

review.postReview(ourAddress, toAddress, privateKey, postReviewData, function(err, returnedTxId){
	if (err) {
		console.log("err" + err );
	} else {
		console.log("Transaction Successful " + returnedTxId );
	}
});	





/*
var bitcore = require('bitcore');

var Transaction = bitcore.Transaction;
var PrivateKey = bitcore.PrivateKey;
var PublicKey = bitcore.PublicKey;
var Script = bitcore.Script;
var Address = bitcore.Address;
var Networks = bitcore.Networks;
var Unit = bitcore.Unit;
//var UnspentOutput = bitcore.UnspentOutput;

var Insight = bitcore.transport.explorers.Insight;

var fromAddress = 'mvpM2EnBDd9UspvJH1sYRurvqtbPCHKcHt';
var fromPrivateKey = '9a4e4db60b986956ebc692a912e7e6d9e7ce5181e8d6b40c288c60be1cf58df5';

var toAddress = 'myfPXggKXyq8DvjCfuaGXNFsDxZbhrEkcx';


//var scriptPubKeyval = Script.buildPublicKeyHashOut(fromAddress);

var data = 'First Note written by Manjunath Chintamani into Blockchain -- Wow!!!';

//var data = 'hello world!!!';
var scriptHash = Script.buildDataOut(data);

console.log("************DATA written to blockchain********"+scriptHash);


var insight = new Insight('https://test-insight.bitpay.com', Networks.testnet);

/*
insight.getUnspentUtxos(fromAddress, function(err, utxos) {
	console.log("---------------------------------- about to get  utxos ------------" );
		if (err) {
			console.log("err" + err );
		} else {
			console.log("utxos: " + utxos );
		}
	}
);
*/

/*
var amount = 0.34980000;
var fromAmtValue = Unit.fromBTC(amount).satoshis;
console.log(" --------------  From Amount created ------ :  " + fromAmtValue);
*/

/*
var simpleUtxoWith100000Satoshis = {
	address: fromAddress,
	txId: 'ddd6451d7a9cbf4b3269ee0755494f5dca4d57ddcfb317196f980debbf856fed',
	outputIndex: 1,
	script: script.toString(),
	satoshis: fromAmtValue
};
*/

/*
var simpleUtxoWith100000Satoshis = {
	address: fromAddress,
	txId: '4a95bfdce08d39e35709ff8eba03bf77d597bc5e6ddbffb8e6f76548c42aded3',
	outputIndex: 1,
	//scriptPubKey: scriptHash,
	script: Script.buildPublicKeyHashOut(fromAddress).toString(),
	satoshis: fromAmtValue
};

*/

/*
var utxo = new Transaction.UnspentOutput({
  "txid" : "4a95bfdce08d39e35709ff8eba03bf77d597bc5e6ddbffb8e6f76548c42aded3",
  "vout" : 1,
  "address" : fromAddress,
  "script": scriptHash,
  "satoshis" : fromAmtValue
});
*/

/*
var toAmount = 0.34970000;
var toAmtValue = Unit.fromBTC(toAmount).satoshis;
console.log(" --------------  To Amount created ------ :  " + toAmtValue);

var transaction = new Transaction()
    .from(simpleUtxoWith100000Satoshis)
	.to(toAddress, toAmtValue)
	.addData(data)
	.change(fromAddress)
	.sign(fromPrivateKey)
	
	
	
console.log(" --------------  transaction created ------ :  " + transaction);

insight.broadcast(transaction, function(err, returnedTxId) {
	console.log("---------------------------------- about to send transaction ------------" );
	if (err) {
		console.log("err" + err );
	} else {
		console.log("returnedTxId: " + returnedTxId );
	}
});
*/






