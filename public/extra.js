$(document).ready(function() {
  $('#row1').localScroll();
  $('#myCarousel2').localScroll();
});

var containers = document.getElementsByClassName("container");

//x is legnth of 3 
var x = document.getElementsByClassName("carousel_caption");
for (var k = 0; k < x.length; k++) {
  x[k].css('top', (containers[k+1].height() - x[k].height())/2);
}

var wrapper = $('#wrapper');
var carousel =  $('#myCarousel2');
wrapper.css('bottom', (carousel.height() - wrapper.height())/2);



