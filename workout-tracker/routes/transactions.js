var Transaction = require('../models/restaurant').Transaction;

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

    /*
    Call Manju's service with following parameters:
    - rating
    - review
    Get back:
     - transactionNumber
     - transactionLink
     */

    var transactionNumber = "From Manju's Service";
    var transactionLink = "From Manju's Service";

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
                        res.json(201, {
                            message: "Review created successfully"
                        });
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