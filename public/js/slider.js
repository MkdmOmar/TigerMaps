$( function() {
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 23,
    values: [ 8, 22 ],
    slide: function( event, ui ) {
      $( "#amount" ).val(ui.values[0] + " - " + ui.values[1]);
      start = ui.values[0];
      end = ui.values[1];
      if (last_click == 'events') { //time changed while events pressed
        unhighlightAll();
        showEvents();
      }
    }
  });
  $( "#amount" ).val($("#slider-range").slider("values", 0) +
    " - " + $("#slider-range").slider( "values", 1));
});
