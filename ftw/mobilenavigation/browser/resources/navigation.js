function close_opened(element) {
  $('.mobileButtons a.selected').each(function(a,b){
    var object = $(b);
    if (object.attr('id') != element.attr('id')) {
      object.click();
    }
  });
}

jQuery(function($) {

  // Hide iphone scrollbar on load
  $('body').scrollTop(1);

  $('#toggle_usermenu').click(function(e){
    e.preventDefault();
    var me = $(this);
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-personaltools dd.actionMenuContent').toggle();
  });

  $('#toggle_search').click(function(e){
    e.preventDefault();
    var me = $(this);
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-searchbox').toggle();
    $('#portal-searchbox input.searchField').focus();
  });

});
