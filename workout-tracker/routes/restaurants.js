var Restaurant = require('../models/restaurant').Restaurant;

exports.index = function(req, res) {
  var id = req.query.id;
  if(typeof id != 'undefined') {
      Restaurant.findById(id, function(err, doc) {
      if(!err && doc) {
        res.json(200, doc);
      } else if(err) {
        res.json(500, { message: "Error loading restaurant." + err});
      } else {
        res.json(404, { message: "Restaurant not found."});
      }
    });
  } else {
      Restaurant.find({}, function(err, docs) {
      if(!err) {
        res.status(200).json({ restaurants: docs })
      } else {
          res.status(500).json({ message: err })
      }
    });
  }
  
}

exports.create = function(req, res) {      
  var restaurantName = req.body.restaurantName;
  var street = req.body.street;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var contact = req.body.contact;
      
Restaurant.findOne({ name: { $regex: new RegExp(restaurantName, "i") } },
function(err, doc) { // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var newRestaurant = new Restaurant();
      
      newRestaurant.restaurantName = restaurantName;
      newRestaurant.street = street;
      newRestaurant.city = city;
      newRestaurant.state = state;
      newRestaurant.country = country;
      newRestaurant.pincode = pincode;
      newRestaurant.contact = contact;
      
      newRestaurant.save(function(err) {
      
        if(!err) {
          res.json(201, {message: "Restaurant created with name: " + newRestaurant.restaurantName });
        } else {
          res.json(500, {message: "Could not register restaurant. Error: " + err});
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