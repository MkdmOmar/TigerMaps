$(window).ready(updateHeight);
$(window).resize(updateHeight);

function updateHeight() {
  console.log("in updateHeight");
  var body = $('#body');
  console.log(body.width());
  console.log($('#horizontal_container').width())
  //if (body.width() > $('#horizontal_container').width()*1.25) {
  if (window.innerWidth > window.innerHeight) {
  	//show horizontal buttons
    console.log("in horizontal");
  	$('#vertical_container').css('display','none');
  	$('#horizontal_container').css('display','block');
  	$('#horizontal_container').css('left',(body.width() - $('#horizontal_container').width()) / 2);

  	//reposition about us
  	//$('#about_us').css('top','0.5em');
  	//$('#about_us').css('bottom','auto');
  	//$('#about_us').css('left','0.75em');

    //if mobile device ...
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     for (var i = 1; i < 5; i++){
      $('#div' + i).css('width','75px');
     } 
     $('#pac-input').css('width','400px');
     $('#new-input').css('width','400px');

     $('#time_range').css({'top':'3.5em','bottom':'auto'});
     $('#slider-range').css({'top':'7.25em','bottom':'auto'});

     $('#about_us').css('display','none');

     //toggle button
     $('#toggle_search').css({'left':'1em','right':'auto'});
     $('#toggle_search').css({'top':'0.5em','bottom':'auto'}); 

     //info_toggle position
     $('#info_toggle').css('display','initial');
     $('#info_toggle').css('bottom','0.5em');
     $('#info_div').css({'left':'1em','bottom':'4em','width':'100px','height':'100px'});

     //horiztonal toggle bar position
     $('#horizontal_container').css('bottom','1em');

    } else {
      if ( (window.innerWidth / window.innerHeight) <= 1206/645 ) {
        $('#time_range').css('top', '0.5em');
        $('#slider-range').css('top', '3.5em');
      } else {
        $('#time_range').css('top', '3em');
        $('#slider-range').css('top', '1em');
      }

     
      //toggle button
      $('#toggle_search').css('right', '420px');
      $('#toggle_search').css('top', '0.5em'); 
    }

  	//show infodiv elements
  	//$('#info_div').css('display','initial');
   	$('#info_toggle').css('display','initial');
    $('#info_hide').html('Show Info');
    toggle_info = 0;  

    //fix slider width
    $('#slider-range').css('width', '60%');

  } else {
  	//show vertical buttons
  	console.log("in vertical");
  	$('#vertical_container').css('display','block');
  	$('#horizontal_container').css('display','none');
  	$('#vertical_container').css('bottom',(body.height() - $('#vertical_container').height()) / 2);

    //if mobile device ...
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     for (var i = 1; i < 5; i++){
      $('#div' + i).css('width','75px');
     } 

     $('#pac-input').css('width','90%');
     $('#new-input').css('width','90%');

     //reposition about us
     $('#about_us').css('display','initial');
     $('#about_us').css({'bottom':'1em','right':'1em','left':'auto','top':'auto'});

     //adjust slider width and placment
     $('#slider-range').css('width', '90%');
     $('#time_range').css({'top':'auto','bottom':'1em'});
     $('#slider-range').css({'top':'auto', 'bottom':'4em'});

     //toggle button
     $('#toggle_search').css('top','6.2em');
     $('#toggle_search').css('right','6em');
  
    } else {
      //reposition about us
      $('#about_us').css('bottom','1em');
      $('#about_us').css('top','auto');
      //$('#about_us').css('right','2em');
      //$('#about_us').css('left','auto');

      //adjust slider width and placment
      $('#slider-range').css('width', '50%');

    }


  	//hide infodiv elements
  	$('#info_div').css('display','none');
   	$('#info_toggle').css('display','none');


  }
  
}

var toggle_info = 0;

function toggleInfo() {
	if (toggle_info == 0) {
		$('#info_div').css('display','initial');
		$('#info_hide').html('Hide Info');
		toggle_info = 1;		
	} else {
		$('#info_div').css('display','none');
		$('#info_hide').html('Show Info');
		toggle_info = 0;	
	}

}