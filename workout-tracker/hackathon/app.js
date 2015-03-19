(function() {
    var template = document.querySelector('template[is=auto-binding]');
    var host="http://localhost:3000/";
    template.toggleDialog1 = function(e) {
        if (e.target.localName != 'span') {
            return;
        }

        var d = e.target.nextElementSibling;
        if (!d) {
            return;
        }
        d.toggle();
    };

    template.searchRestaurant = function(e) {
        var restaurantSearchInput = document.getElementById('restaurantInput').value;
        var restaurantIds = document.getElementById('restaurantSearch').getElementsByTagName('option');
        var selectedRestaurantId;
        for (var i = 0; i < restaurantIds.length; i++) {
            var restaurantId = restaurantIds[i].id;
            var restaurantVal = restaurantIds[i].value;
            if (restaurantVal == restaurantSearchInput) {
                selectedRestaurantId = restaurantId;
            };
        };
        var reviewURL = encodeURI("merchantReview.html?id="+selectedRestaurantId + restaurantSearchInput);
        console.log(reviewURL);
        // window.open(reviewURL, "_top");
    };


    template.newReview = function(e) {
        if (e.target.localName != 'paper-fab') {
            return;
        }

        var d = e.target.nextElementSibling;
        if (!d) {
            return;
        }
        d.toggle();
    };

    template.onSigninFailure = function(e, detail, sender) {
        this.isAuthenticated = false;
    };

    template.onSigninSuccess = function(e, detail, sender) {
        console.log("onSigninSuccess");
        this.isAuthenticated = true;

        // Cached data? We're already using it. Bomb out before making unnecessary requests.
        if ((template.threads && template.users)) {
            return;
        }

        this.gapi = e.detail.gapi;
        gapi.client.load('plus', 'v1').then(function() {
            gapi.client.plus.people.get({
                userId: 'me'
            }).then(function(resp) {
                var PROFILE_IMAGE_SIZE = 75;
                var img = resp.result.image && resp.result.image.url.replace(/(.+)\?sz=\d\d/, "$1?sz=" + PROFILE_IMAGE_SIZE);

                template.user = {
                    name: resp.result.displayName,
                    profile: img || null
                };
            });
        });
    };
    template.newMail = function(e, detail, sender) {
        console.warn('Not implemented: Create new mail');
    };
})();
