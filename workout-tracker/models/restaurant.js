var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
      
var restaurantSchema = new Schema({
    restaurantName : { type: String, required: true, trim: true, index: { unique: true } },
    street : { type: String, required: true },
    city : { type: String, required: true },
    state : { type: String, required: true },
    country : { type: String, required: true },
    pincode : { type: Number, required: true },
    contact : { type: String, required: true },
    date_created : { type: Date, required: true, default: Date.now}
});
      
var transactionSchema = new Schema({
    transactionNumber : { type: String, required: true, trim: true, index: { unique: true } },
    transactionLink : { type: String, required: true },
    restaurantId : { type: String, required: true },
    userId : { type: String, required: true },
    date_created : { type: Date, required: true, default: Date.now}
});

var blockChainSchema = new Schema({
    transactionNumber : { type: String, required: true, trim: true, index: { unique: true } },
    review : { type: String, required: true },
    raiting : { type: String, required: true },
    date_created : { type: Date, required: true, default: Date.now}
});

      
var restaurant = mongoose.model('restaurant', restaurantSchema);
var transaction = mongoose.model('transaction', transactionSchema);
var blockChain = mongoose.model('blockChain', blockChainSchema);

module.exports = {
  Restaurant: restaurant,
  Transaction: transaction,
  BlockChain: blockChain
};

