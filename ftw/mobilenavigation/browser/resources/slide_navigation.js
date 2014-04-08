function load_slider(url, container, fallback) {
  $.ajax({
    type : 'POST',
    url : url,
    success : function(data, textStatus, XMLHttpRequest) {
      if (textStatus == 'success') {
        // make sure there is <div class="slideNavi"> loaded (at position 0)
        var result = 'Could not load navigation children.'
        if (data.search('<div class="slideNavi"') == 0) {
          result = $(data);
        }
        container.html(result);
        fallback;
      }
    }
  });
}

jQuery(function($) {
  $('a.slide').live('click', function(e) {
    e.preventDefault();
    var me = $(this);
    var container = $('#slider-container');
    var slider = container.find('.slideNavi');

    slider.after('<div class="slideNavi loading" style="right:-100%">&nbsp;</div>');
    slider.animate({left: '-100%'});
    $('div.slideNavi.loading').animate({left: 0}, function(){
      slider.remove();
      load_slider(me.attr('href') + '/slider_navi', container, function(){
        $(this).removeClass('loading');
      });
    });

  });

  $('a.slideBack').live('click', function(e) {
    e.preventDefault();
    var me = $(this);
    var container = $('#slider-container');
    var slider = container.find('.slideNavi');

    slider.after('<div class="slideNavi loading" style="left:-100%">&nbsp;</div>');
    slider.animate({right: '-100%'});
    $('div.slideNavi.loading').animate({left: 0}, function(){
      slider.remove();
      load_slider(me.attr('href') + '/slider_navi', container, function(){
        $(this).removeClass('loading');
      });
    });
  });

  $('#toggle_slidenavi').click(function(e){
    e.preventDefault();
    var me = $(this);
    close_opened(me);
    me.toggleClass('selected');
    var container = $('#slider-container');
    if (container.length===0) {
      container = $('<div id="slider-container" style="display: none">' +
                    '<div class="slideNavi loading">&nbsp;</div></div>');
      $('.mobileButtons').after(container);
    }
    container.toggle();
    if (me.hasClass('selected')) {
      load_slider(me.attr('href'), container, function(){});
    }
  });

});
