var BlockChain = require('../models/restaurant').BlockChain;

exports.index = function(req, res) {
  var transactionNumbers = req.query.transactionNumbers;
  if(typeof transactionNumbers != 'undefined') {
      var transactionNumbersArr = transactionNumbers.split(",");

      BlockChain.find({}).where('transactionNumber').in(transactionNumbersArr).exec(function(err, docs) {
        if(!err) {
          res.status(200).json({ reviews: docs, transactionNumbers: transactionNumbers })
        } else {
            res.status(500).json({ message: err })
        }
      })
  } else{
    BlockChain.find({}, function(err, docs) {
    if(!err) {
      res.status(200).json({ reviews: docs })
    } else {
        res.status(500).json({ message: err })
    }
  });    
  }
}

exports.create = function(req, res) {
      
  var transactionNumber = req.body.transactionNumber;
  var review = req.body.review;
  var raiting = req.body.raiting;
      
BlockChain.findOne({ name: { $regex: new RegExp(transactionNumber, "i") } },
function(err, doc) { // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var newBlockChain = new BlockChain();
      
      newBlockChain.transactionNumber = transactionNumber;
      newBlockChain.review = review;
      newBlockChain.raiting = raiting;
      
      newBlockChain.save(function(err) {
      
        if(!err) {
          res.json(201, {message: "Review created with transaction: " + newBlockChain.transactionNumber });
        } else {
          res.json(500, {message: "Could not create review. Error: " + err});
        }
      
      });
      
    } else if(!err) {
      
      // User is trying to create a workout with a name that already exists.
      res.json(403, {message: "Review with that transaction already exists, please update instead of create or create a new review with a different transaction."});
    } else {
      res.json(500, { message: err});
    }
  });
      
}
