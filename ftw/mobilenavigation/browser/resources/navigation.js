function load_children(element, parent) {
  parent.addClass('loading');

  var level = 1
  if (parent.hasClass('level1')) {level = 2;}
  if (parent.hasClass('level2')) {level = 3;}

  jq.ajax({
    type : 'POST',
    url : element.attr('href'),
    data: {level: level},
    success : function(data, textStatus, XMLHttpRequest) {
      if (textStatus == 'success') {
        parent.removeClass('loading');
        var result = $(data);
        load_navi_buttons(result);
        parent.append(result);
      }
    }
  });
}

function load_navi_buttons(section) {
  section.find('li').each(function(a,b){
    element = $(b);
    if (!element.hasClass('noChildren')) {
      var href = element.find('a:first').attr('href') + '/load_children';
      element.append($('<a class="loadChildren" href="'+href+'"></a>'));
    }
  });
}

jQuery(function($) {

  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#portal-globalnav').addClass('mobileNavigation');
  }

  load_navi_buttons($('#portal-globalnav.mobileNavigation'));

  $('a.loadChildren').live('click', function(e){
    e.preventDefault();
    var me = $(this);
    var parent = me.parent('li');

    var children = parent.find('ul:first');
    console.info(children);
    if (children.length == 0) {
      load_children(me, parent);
    }

    parent.toggleClass('expanded');

  });

});
