(function() {
	var template = document.querySelector('template[is=auto-binding]');

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

	template.onSigninSuccess = function(e, detail, sender) {
		console.log("onSigninSuccess");
			this.isAuthenticated = true;

	    if ((template.threads && template.users)) {
	        return;
	    }

		this.gapi = e.detail.gapi;
		gapi.client.load('plus', 'v1').then(function() {
	    	gapi.client.plus.people.get({
	            userId: 'me'
	        }).then(function(resp) {
	        	template.user = {
	                name: resp.result.displayName
	            };
	        });
	    });
	};
	template.newMail = function(e, detail, sender) {
		console.warn('Not implemented: Create new mail');
	};
})();
