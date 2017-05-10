var dates = new Array(7); // 1 week = 7 days
for (var i = 0; i < dates.length; i++)
{
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + i);
  dates[i] = currentDate;
}

function timeConvert(time){
  var hour = ((time % 12) == 0) ? 12 : (time % 12)
  var converted_time = "" + hour + ":00"
  if ((time / 12) == 0){
    converted_time += "am";
  } else {
    converted_time += "pm";
  }
  return converted_time;
}

function dateConvert(dateobj){
  var month= ("" + (dateobj.getMonth()+1)).slice(-2);
  var date = ("" + dateobj.getDate()).slice(-2);
  var year = dateobj.getFullYear();
  return month + "/" + date + "/" + year;
}

$( function() {
  $( "#time-slider" ).slider({
    range: true,
    min: 0,
    max: 23,
    values: [ 0, 23 ],
    slide: function( event, ui ) {
      $( "#time-range" ).val(timeConvert(ui.values[0]) + " - " + timeConvert(ui.values[1]));
      start_time = ui.values[0];
      end_time = ui.values[1];
      if (last_click == 'events') { // time changed while events pressed
        unhighlightAll();
        showEvents();
      }
    }
  });
  $( "#time-slider .ui-slider-handle" ).css('background', 'rgb(255,153,0)');
  $( "#time-range" ).val(timeConvert($("#time-slider").slider("values", 0)) +
    " - " + timeConvert($("#time-slider").slider( "values", 1)));
});

$( function() {
  $( "#date-slider" ).slider({
    range: true,
    min: 0,
    max: 6,
    values: [0, 6],
    slide: function( event, ui ) {
      $( "#date-range" ).val(dateConvert(dates[ui.values[0]]) + " - " + dateConvert(dates[ui.values[1]]));
      start_date = ui.values[0];
      end_date = ui.values[1];
      if (last_click == 'events') { // time changed while events pressed
        unhighlightAll();
        showEvents();
      }
    }
  });
  $( "#date-slider .ui-slider-handle" ).css('background', 'rgb(255,153,0)');
  $( "#date-range" ).val(dateConvert(dates[$("#date-slider").slider("values", 0)]) +
    " - " + dateConvert(dates[$("#date-slider").slider("values", 1)]));
});
