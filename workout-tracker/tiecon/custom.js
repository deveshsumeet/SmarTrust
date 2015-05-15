$(function() {
  $('.search a').on('click', function() {
      $('.search input').fadeToggle('400').focus();
      $(this).toggleClass('active');
      return false;
  });
});

$(document).ready(function(){
$.ajax({
    url: "/transactions?restaurantId=smartrust.01@gmail.com",
    type: "GET",
    dataType : "json",
    success: function( data ) {
		$.each(data, function() {
  			$.each(this, function(key,value) {
  				if ( key == "review") {
  					var $commentBox = $("<article class='comment'><div class='comment-body'><div class='text'><p></p><span class='star'></span></div></div></article>");
  					var $abc = $commentBox.find("p").text(value);
                    $('section').append($commentBox);
  				}	
  			});
		});
    }
});
});