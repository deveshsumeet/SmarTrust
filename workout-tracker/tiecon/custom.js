$(function() {
  $('.search a').on('click', function() {
      $('.search input').fadeToggle('400').focus();
      $(this).toggleClass('active');
      return false;
  });
});