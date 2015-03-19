var Transaction = require('../models/restaurant').Transaction;

exports.index = function(req, res) {
  var restaurantId = req.query.restaurantId;
  var userId = req.query.userId;
  var findCriteria = {};
  if(typeof restaurantId != 'undefined'){
    findCriteria["restaurantId"] = restaurantId;
  }
  if(typeof userId != 'undefined'){
    findCriteria["userId"] = userId;
  }  
  Transaction.find(findCriteria).select('transactionNumber -_id').exec(function(err, docs) {
  if(!err) {
    res.status(200).json({ transaction: docs })
  } else {
      res.status(500).json({ message: err })
  }
});
}

exports.create = function(req, res) {
      
  var transactionNumber = req.body.transactionNumber;
  var transactionLink = req.body.transactionLink;
  var restaurantId = req.body.restaurantId;
  var userId = req.body.userId;
      
Transaction.findOne({ name: { $regex: new RegExp(transactionNumber, "i") } },
function(err, doc) { // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var newTransaction = new Transaction();
      
      newTransaction.transactionNumber = transactionNumber;
      newTransaction.transactionLink = transactionLink;
      newTransaction.restaurantId = restaurantId;
      newTransaction.userId = userId;
      
      newTransaction.save(function(err) {
      
        if(!err) {
          res.json(201, {message: "Transaction created with name: " + newTransaction.transactionNumber });
        } else {
          res.json(500, {message: "Could not create transaction. Error: " + err});
        }
      
      });
      
    } else if(!err) {
      
      // User is trying to create a workout with a name that already exists.
      res.json(403, {message: "Restaurant with that name already exists, please update instead of create or create a new restaurant with a different name."});
    } else {
      res.json(500, { message: err});
    }
  });
      
}
