var x = new XMLHttpRequest();
x.open("GET", "http://feed.example/", true);
x.onreadystatechange = function () {
  if (x.readyState == 4 && x.status == 200)
  {
    var doc = x.responseXML;
    // …
  }
};
x.send(null);
