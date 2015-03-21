var Transaction = require('../models/restaurant').Transaction;
var bitcore = require('bitcore');

var Review = require('./../lib/postReview.js');
var BlockchainTransactions = require('./../lib/blockchaintrasactions.js');

var merchantPrivatekeys = require('./../keys/MerchantPrivateKeys');
var merchantPublickeys = require('./../keys/MerchantPublicKeys');
var merchantAddresskeys = require('./../keys/merchantAddresskeys');
var Networks = bitcore.Networks;

var reviewToBlockchain = new Review('https://test-insight.bitpay.com', Networks.testnet);
var blockChainTransaction = new BlockchainTransactions();

exports.index = function (req, res) {
    var restaurantId = req.query.restaurantId;
    var userId = req.query.userId;
    var findCriteria = {};
    if (typeof restaurantId != 'undefined') {
        findCriteria["restaurantId"] = restaurantId;
    }
    if (typeof userId != 'undefined') {
        findCriteria["userId"] = userId;
    }
    Transaction.find(findCriteria).select('userId restaurantId transactionNumber -_id').exec(function (err, docs) {
        if (!err) {
            /*
             use Manju's function with docs as input. It should create a json object with following fields:
             - rating
             - review
             - if (typeof restaurantId != 'undefined')
             restaurantId
             else
             userId
             
             
             */
             console.log(docs);
             
            var reviews = [];
            for(count=0;count<docs.length;count++)
            {
	            var transactionNumber = docs[count].transactionNumber
	            
	            blockChainTransaction.getUserReviewByTransaction(transactionNumber,function(err, transactionData){
		           if (err) {
						console.log("err" + err );
					} else {
						
						if (typeof restaurantId != 'undefined') {
					        transactionData["userId"] = userId;
					    }
					    if (typeof userId != 'undefined') {
					        transactionData["restaurantId"] = restaurantId;
					    }
						reviews.push(transactionData);	
					}	
	        	});
            }
            res.status(200).json(reviews);

                        
        } else {
            res.status(500).json({
                message: err
            })
        }
    });
};

exports.create = function (req, res) {

    var restaurantId = req.body.restaurantId;
    var userId = req.body.userId;
    var rating = req.body.rating;
    var review = req.body.review;
    
    if (userId=="undefined" || userId=="") {
	    userId = "anonymous";
    }
    
     console.log('************ ready to transmit-review *************'+restaurantId);
	 console.log('************ ready to transmit-review *************'+userId);
	 console.log('************ ready to transmit-review *************'+rating);
	 console.log('************ ready to transmit-ratings *************'+review);

    /*
    Call Manju's service with following parameters:
    - rating
    - review
    Get back:
     - transactionNumber
     - transactionLink
     */

     var fromAddress = merchantAddresskeys.merchant1;
	 var privateKey = merchantPrivatekeys.merchant1; 
	
	 var toAddress = merchantAddresskeys.merchant2;
	
	 console.log('************ ourAddress *************'+fromAddress);
	 console.log('************ privateKey *************'+privateKey);
	 console.log('************ toAddress *************'+toAddress);
	
	 console.log('************ ready to transmit-review *************'+restaurantId);
	 console.log('************ ready to transmit-review *************'+userId);
	 console.log('************ ready to transmit-review *************'+rating);
	 console.log('************ ready to transmit-ratings *************'+review);
	 
	 
	 reviewToBlockchain.postReview(fromAddress, toAddress, privateKey, rating, review,function(err, returnedTxId){
		if (err) {
			console.log("err" + err );
		} else {
			console.log("Transaction Successful " + returnedTxId );
			var transactionNumber = returnedTxId;
			var transactionLink = "https://chain.so/tx/BTCTEST/"+returnedTxId;
			
			Transaction.findOne({
	            transactionNumber: {
	                $regex: new RegExp(transactionNumber, "i")
	            }
	        }, 
	        function (err, doc) { // Using RegEx - search is case insensitive
	            if (!err && !doc) {
	
	                var newTransaction = new Transaction();
	
	                newTransaction.transactionNumber = transactionNumber;
	                newTransaction.transactionLink = transactionLink;
	                newTransaction.restaurantId = restaurantId;
	                newTransaction.userId = userId;
	
	                newTransaction.save(function (err) {
	
	                    if (!err) {
		                    console.log("Transaction Saved" + transactionNumber );
	                        res.status(201).json({ "transactionNumber": transactionNumber,"transactionLink":transactionLink })
	                    } else {
	                        res.json(500, {
	                            message: "Could not create transaction. Error: " + err
	                        });
	                    }
	
	                });
	
	            } else if (!err) {
	                res.json(403, {
	                    message: "Review with that id already exists, please update instead of create or create a new restaurant with a different name."
	                });
	            } else {
	                res.json(500, {
	                    message: err
	                });
            }
        });			
			
			
		}
 	});	
}