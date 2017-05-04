$(window).ready(updateHeight);
$(window).resize(updateHeight);

function updateHeight() {
  console.log("in updateHeight");
  var body = $('#body');
  console.log(body.width());
  console.log($('#horizontal_container').width())
  if (body.width() > $('#horizontal_container').width()*1.25) {
  	//show horizontal buttons
    console.log("in horizontal");
  	$('#vertical_container').css('display','none');
  	$('#horizontal_container').css('display','block');
  	$('#horizontal_container').css('left',(body.width() - $('#horizontal_container').width()) / 2);

  	//reposition about us
  	$('#about_us').css('top','0.5em');
  	$('#about_us').css('bottom','auto');
  	$('#about_us').css('left','8em');

  	//show infodiv elements
  	//$('#info_div').css('display','initial');
   	$('#info_toggle').css('display','initial');
    $('#info_hide').html('Show Info');
    toggle_info = 0;  

  } else {
  	//show vertical buttons
  	console.log("in vertical");
  	$('#vertical_container').css('display','block');
  	$('#horizontal_container').css('display','none');
  	$('#vertical_container').css('bottom',(body.height() - $('#vertical_container').height()) / 2);
  	
  	//reposition about us
  	$('#about_us').css('bottom','1em');
  	$('#about_us').css('top','auto');
  	$('#about_us').css('left','2em');

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