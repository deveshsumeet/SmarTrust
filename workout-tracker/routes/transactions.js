'use strict'

var Transaction = require('../models/restaurant').Transaction;
var bitcore = require('bitcore');
var async = require('async');

var ipfs = require('ipfs-api')('localhost', 5001);

var Review = require('./../lib/postReview.js');
var BlockchainTransactions = require('./../lib/blockchaintrasactions.js');

var merchantPrivatekeys = require('./../keys/MerchantPrivateKeys');
var merchantPublickeys = require('./../keys/MerchantPublicKeys');
var merchantAddresskeys = require('./../keys/MerchantAddresskeys');
var Networks = bitcore.Networks;

var reviewToBlockchain = new Review('https://test-insight.bitpay.com', Networks.testnet);
var blockChainTransaction = new BlockchainTransactions();

exports.index = function (req, res) {
    console.log("in transaction")
    var restaurantId = req.query.restaurantId;
    var userId = req.query.userId;
    var findCriteria = {};
    if (typeof restaurantId != 'undefined') {
        findCriteria["restaurantId"] = restaurantId;
    }
    if (typeof userId != 'undefined') {
        findCriteria["userId"] = userId;
    }
    Transaction.find(findCriteria).select('userId restaurantId restaurantName transactionNumber fileHash -_id').exec(function (err, docs) {
        if (!err) {

            var reviews = [];

            async.forEach(docs, function (item, callback) {
                var transactionNumber = item.transactionNumber;
                console.log(transactionNumber);

                blockChainTransaction.getUserReviewByTransaction(transactionNumber, function (err, transactionData) {
                    if (err) {
                        console.log("err" + err);
                    } else {


                        if (transactionData != "") {
                            transactionData = JSON.parse(transactionData);
                            if (typeof restaurantId != 'undefined') {
                                transactionData["userId"] = item.userId;
                                if (item.fileHash) {
                                    transactionData["fileHash"] = item.fileHash;
                                }
                            } else if (typeof userId != 'undefined') {
                                transactionData["restaurantId"] = item.restaurantId;
                                transactionData["restaurantName"] = item.restaurantName;
                            }
                            reviews.push(transactionData);
                            callback();
                        } else {
                            callback();
                        }
                    }
                });
            }, function () {
                res.status(200).json(reviews);
            });

        } else {
            res.status(500).json({
                message: err
            })
        }
    });
};

exports.create = function (req, res) {

    var restaurantId = req.body.restaurantId;
    var restaurantName = req.body.restaurantName;
    var userId = req.body.userId;
    var rating = req.body.rating;
    var review = req.body.review;

    if (!userId) {
        userId = "anonymous";
    }

    var fromAddress = merchantAddresskeys.merchant1;
    var privateKey = merchantPrivatekeys.merchant1;

    var toAddress = merchantAddresskeys.merchant2;


    var fileHash = '';
    if (req.files) {
        if (req.files.reviewImage) {
            var files = req.files.reviewImage.path;
            var fileData = {};
            ipfs.add([files], function (err, resp) {
                if (err || !resp) {
                    return console.log(err);
                }

                for (var i = 0; i < resp.length; i++) {
                    console.log(resp[i]);
                    fileData = resp[i];
                }
                fileHash = fileData["Hash"];
                postReview(fromAddress, toAddress, privateKey, rating, review, fileHash, restaurantId, restaurantName, userId, req, res);
            });
        } else {
            postReview(fromAddress, toAddress, privateKey, rating, review, fileHash, restaurantId, restaurantName, userId, req, res);
        }
    }
    console.log('**************  File hash before submitting the review is : ' + fileHash + '  **************');

}

function postReview(fromAddress, toAddress, privateKey, rating, review, fileHash, restaurantId, restaurantName, userId, req, res) {
    reviewToBlockchain.postReview(fromAddress, toAddress, privateKey, rating, review, fileHash, function (err, returnedTxId) {
        if (err) {
            console.log("err" + err);
        } else {
            console.log("Transaction Successful " + returnedTxId);
            var transactionNumber = returnedTxId;
            var transactionLink = "https://chain.so/tx/BTCTEST/" + returnedTxId;

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
                        newTransaction.restaurantName = restaurantName;
                        newTransaction.userId = userId;
                        newTransaction.fileHash = fileHash;

                        newTransaction.save(function (err) {

                            if (!err) {
                                console.log("Transaction Saved" + transactionNumber);
                                res.status(201).json({
                                    "transactionNumber": transactionNumber,
                                    "transactionLink": transactionLink
                                })
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