(function() {
    var template = document.querySelector('template[is=auto-binding]');
    var host="http://localhost:3000/";
    var isAuthenticated = false;

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
    template.getrestautantID = function(e){
        var restaurantId="";
        console.log("QueryString");
        var restaurantId = "";
        var query = window.location.search.substring(1);
        console.log(query);
        var vars = query.split("&");
        console.log(vars);
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            restaurantId = pair[1];
        }
        console.log("restaurantId: ");
        console.log(restaurantId);
        return restaurantId;
    }

    template.searchRestaurant = function(e) {
        console.log("searchRestaurant");
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
        var reviewURL = encodeURI("merchantReview.html?id="+selectedRestaurantId);
        console.log(reviewURL);
        window.open(reviewURL, "_top");
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
                console.log(resp.result);
                template.user = {
                    name: resp.result.displayName,
                    profile: img || null,
                    email: resp.result.emails[0].value
                };
            });
        });

        var myReviewsMenu = document.getElementById("myReviewsMenu");
        myReviewsMenu.className = "menu";
    };

    template.onSignoutSuccess = function(e, detail, sender) {
        console.log("onSignoutSuccess");
        this.isAuthenticated = false;

        template.user = {
            name: null,
            profile: null,
            email: null
        };

        var myReviewsMenu = document.getElementById("myReviewsMenu");
        myReviewsMenu.className = "hiddenMenu";
    };

    template.newMail = function(e, detail, sender) {
        console.warn('Not implemented: Create new mail');
    };

    template.doSend = function(event, detail, sender){
        console.log(detail);
        var coreAjax = document.querySelector('core-ajax');
        coreAjax.go();
    };
})();
