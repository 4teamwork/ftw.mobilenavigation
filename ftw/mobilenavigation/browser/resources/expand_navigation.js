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

function is_mobile() {
  if (window.matchMedia == undefined) {
    if (screen.width <= 767) {
      return true;
    }
    return false;
  }
  else if (window.matchMedia("(max-width: 767px)").matches) {
    return true;
  }
  return false;
}

function initialize_mobile_navi() {
  var body = $("body");

  if (is_mobile()) {
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
    // if the browser is resized bigger than 767 px
    $('#portal-globalnav').removeClass('mobileNavigation');
  }
}

jQuery(function($) {
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
