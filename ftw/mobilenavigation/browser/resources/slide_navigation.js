var direction = {
  next : {
    slideNavi : 'right',
    animation : 'left'
  },
  prev : {
    slideNavi : 'left',
    animation : 'right'
  }
};

var settings = {
  //!only works with percentage
  animationOffset : '95%'
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
        fallback.call(this);
      }
    }
  });

  getChildrenRequest.fail(function(jqXHR, textStatus) {
    console.error("Error while loading mobilenavigation", textStatus);
  });
}

function slide(direction) {
  var animationSettings = {};
  animationSettings[direction.animation] = '-' + settings.animationOffset;
  var me = $(this);
  var container = $('#slider-container');
  var slider = container.find('.slideNavi');
  slider.after('<div class="slideNavi loading" style="' + direction.slideNavi + ':-' + settings.animationOffset + '">&nbsp;</div>');
  slider.animate(animationSettings);
  $('div.slideNavi.loading').animate({
    left: 100 - (parseInt(settings.animationOffset)) + '%'
  }, function() {
    slider.remove();
    load_slider(me.attr('href') + '/slider_navi', container, function() {
      $(this).removeClass('loading');
    });
  });
}


jQuery(function($) {

  var slide_handler = function(e) {
    e.preventDefault();
    slide.call(this,direction.next);
  }

  var slide_back_handler = function(e) {
    e.preventDefault();
    slide.call(this, direction.prev);
  }

  if (typeof $.fn.on !== undefined) {
    $(document).on('click', 'a.slide', slide_handler);
    $(document).on('click', 'a.slideBack', slide_back_handler);
  } else {
    $('a.slide').live('click', click_handler);
    $('a.slideBack').live('click', click_back_handler);
  }

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
