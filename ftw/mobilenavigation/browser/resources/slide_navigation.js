var direction = {
  next : {
    slideNavi : right,
    animation : left
  },
  prev : {
    slideNavi : left,
    animation : right
  }
};


function load_slider(url, container, fallback) {
  var getChildrenRequest = $.ajax({
    type: 'POST',
    url: url,
  });

  getChildrenRequest.done(function(data) {
    //check if the response contains slideNavi elements
    if ($('div.slideNavi', data).length === 0) {
      container.html($(data));
      if (fallback) {
        fallback.call();
      }
    }
  });

  getChildrenRequest.fail(function(jqXHR, textStatus) {
    console.error("Error while loading mobilenavigation", textStatus);
  });
}

function slide(direction) {
  e.preventDefault();
  var animationSettings = {};
  animationSettings[direction.animation] = '-100%';
  var me = $(this);
  var container = $('#slider-container');
  var slider = container.find('.slideNavi');
  slider.after('<div class="slideNavi loading" style="' + direction.slideNavi + ':-100%">&nbsp;</div>');
  slider.animate(animationSettings);
  $('div.slideNavi.loading').animate({
    left: 0
  }, function() {
    slider.remove();
    load_slider(me.attr('href') + '/slider_navi', container, function() {
      $(this).removeClass('loading');
    });
  });
}

jQuery(function($) {
  $('a.slide').live('click', function(e) {
    slide(direction.next);
  });

  $('a.slideBack').live('click', function(e) {
    slide(direction.prev);
  });

  $('#toggle_slidenavi').click(function(e) {
    e.preventDefault();
    var me = $(this);
    close_opened(me);
    me.toggleClass('selected');
    var container = $('#slider-container');
    if (container.length === 0) {
      container = $('<div id="slider-container" style="display: none">' +
        '<div class="slideNavi loading">&nbsp;</div></div>');
      $('.mobileButtons').after(container);
    }
    container.toggle();
    if (me.hasClass('selected')) {
      load_slider(me.attr('href'), container);
    }
  });

});
