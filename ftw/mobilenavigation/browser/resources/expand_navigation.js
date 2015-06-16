var spinner;
var naviParent;
var naviElement;

function load_children(element, parent) {

  //get level from parent element
  var level = '';
  var parentClass = parent.attr('class');
  if (parentClass) {
    level = $.grep(parentClass.split(" "), function(elm, idx) {
      //check if parent element has level class
      return elm.indexOf('level') === 0;
    }).join().replace(/^\D+/g, '');
  }

  //parent has no level
  if (level === '') {
    parent.addClass('loading');
    level = 0;
  } else {
    // get next level
    level = parseInt(level);
    level++;
  }

  //make request for loading the next level
  var getChildrenRequest = $.ajax({
    type: 'POST',
    url: element.attr('href'),
    data: {
      level: level
    },
  });

  getChildrenRequest.done(function(data) {
    //check if the response contains ul elements
    if ($('ul', data).length === 0) {
      var result = $(data);
      //Remove background-image style
      parent.children('.loadChildren').attr('style', function(idx, style) {
        if(style) {
          return style.replace(/background-image[^;]+;?/g, '');
        }
      });
      load_navi_buttons(result);
      if (level === 0) {
        parent.replaceWith(result);

        var lis = result.find('li');
        parent.find('li').each(function(idx, elm) {
          lis.eq(idx).addClass($(elm).attr('class'));
        });

      } else {
        parent.removeClass('loading');
        parent.append(result);
      }
    }
  });

  getChildrenRequest.fail(function(jqXHR, textStatus) {
    if (!(naviParent && naviElement)) {
      naviParent = parent;
      naviElement = element;
    } else {
      naviParent = parent;
      naviElement = element;
    }
    console.error("Error while loading mobilenavigation", textStatus);
    //Try again if loading children failed
    naviParent.children('.loadChildren').die().css('background-image', "url(" + spinner.src + ")");
    window.setTimeout(function() {
      load_children(naviElement, naviParent);
    }, 5000);
  });
}

function load_navi_buttons(section) {
  section.find('li').each(function(idx, elm) {
    element = $(elm);
    if (!element.hasClass('noChildren')) {
      var href = element.find('a:first').attr('href') + '/load_children';
      element.append($('<a class="loadChildren" href="' + href + '">&nbsp;</a>'));
    }
  });
}

function is_mobile() {
  if (window.matchMedia === undefined) {
    if (screen.width <= 769) {
      return true;
    }
    return false;
  } else if (window.matchMedia("(max-width: 769px)").matches) {
    return true;
  }
  return false;
}

function initialize_mobile_navi() {
  var body = $("body");
  spinner = new Image();
  spinner.src = portal_url + '/++resource++ftw.mobilenavigation/spinner.gif';
  spinner.id = 'spinner-preload';
  spinner.onload = function() {
    if (is_mobile()) {
      if (!body.hasClass('mobileNaviLoaded')) {
        // load globalnav buttons
        load_children($('#toggle_navigation'), $('#portal-globalnav'));
        load_navi_buttons($('#portal-globalnav.mobileNavigation'));
        body.addClass('mobileNaviLoaded');
      } else {
        $('#portal-globalnav').addClass('mobileNavigation');
      }
    } else {
      // if the browser is resized bigger than 769 px
      $('#portal-globalnav').removeClass('mobileNavigation');
    }
  };
}

jQuery(function($) {
  initialize_mobile_navi();

  $(window).resize(function() {
    initialize_mobile_navi();
  });

  $('#toggle_navigation').click(function(e) {
    e.preventDefault();
    var me = $(this);
    close_opened(me);
    me.toggleClass('selected');
    $('#portal-globalnav').toggle();
  });

  var click_handler = function(e) {
    e.preventDefault();
    var me = $(this);
    var parent = me.parent('li');

    var children = parent.find('ul:first');
    if (children.length === 0) {
      load_children(me, parent);
    }
    parent.toggleClass('expanded');
  };

  if (typeof $.fn.on !== undefined) {
    $(document).on('click', 'a.loadChildren', click_handler);
  } else {
    $('a.loadChildren').live('click', click_handler);
  }

});
