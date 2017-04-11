;
/*
*
*
* author: Diwanee Serbia / Aleksandar Veljkovic
*
*
*/

(function ($) {
  var pub = {};
  pub.elements = [];
  pub.timer = null;
  var w = window;

  $.event.special.horizons = {

    add: function(handleObj){
      var $el = $(this).eq(0); // @toDo forEach
      pub.elements.push({handleObj: handleObj, $el: $el, state: null});
      $el.data('horizons', pub);
      $el.addClass('horizons');
      if (!pub.timer && pub.elements.length) {
        pub.timer = setInterval(pub.testState, 250);
        $(window).on('scroll', pub.testState);
        $(window).on('resize', pub.testState);
      }
    },
    remove: function(handleObj){
      var $el = $(this).eq(0); // @toDo forEach
      $.each(pub.elements, function(i, o){
        if (o.$el[0] === $el[0] && o.handleObj.guid === $el.data("horizons").elements[i].handleObj.guid) {
          pub.elements.splice(i, 1);
          $el.removeData("horizons");
          $el.removeClass('horizons');
          return false;
        }
      });
      if (!pub.elements.length) {
         clearInterval(pub.timer);
         $(window).off('scroll', pub.testState);
         $(window).off('resize', pub.testState);
         pub.timer = null;
      }
    }
  };

  pub.testState = function(){
    $.each(pub.elements, function(i, o){
      var state = pub.state(o.$el);
      if (JSON.stringify(o.state) !== JSON.stringify(state)) {
        o.state = state;
        o.$el.trigger('horizons', state);
      }
    });
  };

  pub.meshures = function($els) {
    var $el = $els.eq(0);
    //var viewportHeight = w.innerHeight;
    //var viewportWidth = w.innerWidth;
    var viewportHeight = $(w).height();
    var viewportWidth = $(w).width();
    var elementHeight = $el.outerHeight(false);
    var elementWidth = $el.outerWidth(false);
    var bcr = $el[0].getBoundingClientRect();
    var meshures = {
      tn: bcr.top,
      ts: - bcr.top + viewportHeight,
      bn: bcr.top + elementHeight,
      bs: - (bcr.top + elementHeight) + viewportHeight,
      lw: bcr.left,
      le: - bcr.left + viewportWidth,
      rw: bcr.left + elementWidth,
      re: - (bcr.left + elementWidth) + viewportWidth
    };
    //console.log(JSON.stringify(meshures));
    return meshures;
  };

  pub.state = function($els) {
    var $el = $els.eq(0);
    var meshures = pub.meshures($el);


    var state = {
      t: (meshures.tn * meshures.ts) >= 0 ? true : (meshures.tn < 0 && meshures.ts > 0) ? "north" : "south",
      b: (meshures.bn * meshures.bs) >= 0 ? true : (meshures.bn < 0 && meshures.bs > 0) ? "north" : "south",
      l: (meshures.lw * meshures.le) >= 0 ? true : (meshures.le < 0 && meshures.lw > 0) ? "west" : "east",
      r: (meshures.rw * meshures.re) >= 0 ? true : (meshures.re < 0 && meshures.rw > 0) ? "west" : "east"

    };
    //console.log(JSON.stringify(state));
    return state;
  };

  window.horizons = pub;

})(jQuery);
