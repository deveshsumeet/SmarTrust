var Restaurant = require('../models/restaurant').Restaurant;

exports.index = function (req, res) {
    var restaurantId = req.query.restaurantId;
    var findCriteria = {};
    if (typeof restaurantId != 'undefined') {
        findCriteria["restaurantId"] = restaurantId;
    }
    Restaurant.find(findCriteria, function (err, docs) {
        if (!err) {
            res.status(200).json({
                restaurants: docs
            })
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
    var street = req.body.street;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    var pincode = req.body.pincode;
    var contact = req.body.contact;

    Restaurant.findOne({
            restaurantId: {
                $regex: new RegExp(restaurantId, "i")
            }
        },
        function (err, doc) { // Using RegEx - search is case insensitive
            if (!err && !doc) {
                var newRestaurant = new Restaurant();
                newRestaurant.restaurantId = restaurantId;
                newRestaurant.restaurantName = restaurantName;
                newRestaurant.street = street;
                newRestaurant.city = city;
                newRestaurant.state = state;
                newRestaurant.country = country;
                newRestaurant.pincode = pincode;
                newRestaurant.contact = contact;

                newRestaurant.save(function (err) {

                    if (!err) {
                        res.json(201, {
                            message: "Restaurant created with name: " + newRestaurant.restaurantName
                        });
                    } else {
                        res.json(500, {
                            message: "Could not register restaurant. Error: " + err
                        });
                    }

                });

            } else if (!err) {

                // User is trying to create a workout with a name that already exists.
                res.json(403, {
                    message: "Restaurant already exists, please update instead of create or create a new restaurant with a different name."
                });
            } else {
                res.json(500, {
                    message: err
                });
            }
        });

};