function load_children(element, parent) {
  var level = 0
  if (parent.hasClass('level0')) {level = 1;}
  if (parent.hasClass('level1')) {level = 2;}
  if (parent.hasClass('level2')) {level = 3;}

  if (level > 0) {
    parent.addClass('loading');
  }

  $.ajax({
    type : 'POST',
    url : element.attr('href'),
    data: {level: level},
    success : function(data, textStatus, XMLHttpRequest) {
      if (textStatus == 'success') {
        var result = $(data);
        load_navi_buttons(result);
        if (level == 0) {
          parent.replaceWith(result);
        }
        else {
          parent.removeClass('loading');
          parent.append(result);
        }
      }
    }
  });
}

function load_navi_buttons(section) {
  section.find('li').each(function(a,b){
    element = $(b);
    if (!element.hasClass('noChildren')) {
      var href = element.find('a:first').attr('href') + '/load_children';
      element.append($('<a class="loadChildren" href="'+href+'">&nbsp;</a>'));
    }
  });
}

function initialize_mobile_navi() {
  if (!$.browser.msie) {
    var body = $("body");
    if (window.matchMedia("(max-width: 767px)").matches) {
      if (!body.hasClass('mobileNaviLoaded')) {
        // load globalnav buttons
        load_children($('#toggle_navigation'), $('#portal-globalnav'));
        load_navi_buttons($('#portal-globalnav.mobileNavigation'));
        body.addClass('mobileNaviLoaded');
      }
      else {
        $('#portal-globalnav').addClass('mobileNavigation');
      }
    }
    else {
      $('#portal-globalnav').removeClass('mobileNavigation');
    }
  }
}


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

  initialize_mobile_navi();

  $(window).resize(function() {
    initialize_mobile_navi();
  });

  $('#toggle_navigation').click(function(e){
    e.preventDefault();
    var me = $(this)
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-globalnav').toggle();
  });

  $('#toggle_usermenu').click(function(e){
    e.preventDefault();
    var me = $(this)
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-personaltools dd.actionMenuContent').toggle();
  });

  $('#toggle_search').click(function(e){
    e.preventDefault();
    var me = $(this)
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-searchbox').toggle();
    $('#portal-searchbox input.searchField').focus();
  });

  $('a.loadChildren').live('click', function(e){
    e.preventDefault();
    var me = $(this);
    var parent = me.parent('li');

    var children = parent.find('ul:first');
    if (children.length == 0) {
      load_children(me, parent);
    }

    parent.toggleClass('expanded');

  });

});
