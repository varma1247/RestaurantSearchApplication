var radius = 784;
var qlat = 32.75;
var qlong = -97.13;
var markersArray = [];
var marker1;
function initialize() {
  document.getElementById('scroll').innerText = ' ';
  google.maps.event.addListener(map, "idle", function() {
    qlat = map.getCenter().lat();
    qlong = map.getCenter().lng();
    var bounds = map.getBounds();
    var center = map.getCenter();
    if (bounds && center) {
      var ne = bounds.getNorthEast();
      // Calculate radius (in meters).
      radius = parseInt(google.maps.geometry.spherical.computeDistanceBetween(center, ne))-100;
      console.log(radius);
    }
  });
}

function sendRequest() {
  // setMapOnAll(null);
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  };
  document.getElementById('list').innerHTML = '';
  var search = document.getElementById("search").value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "proxy.php?term=" + search + "&latitude=" + qlat + "&longitude=" + qlong + "&radius=" + radius + "&limit=10");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var json = JSON.parse(this.responseText);
      // var str = JSON.stringify(json,undefined,2);
      // document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
      console.log(json.businesses);
      json.businesses.forEach(function(arrayitem, index) {
        var label = index + 1;
        var lati = arrayitem.coordinates.latitude;
        var long = arrayitem.coordinates.longitude;
        console.log(lati + " " + long);
        var markerpos = new google.maps.LatLng(lati, long);
        var marker = new google.maps.Marker({
          position: markerpos,
          animation: google.maps.Animation.DROP,
          label: "" + label
        });
        markersArray.push(marker);
        // marker.setMap(map);
        var imgurl = arrayitem.image_url;
        var name = arrayitem.name;
        var rating = arrayitem.rating;
        var url = arrayitem.url;
        var reviewcount = arrayitem.review_count;
        var liTag = document.createElement('li');
        var imgTag = document.createElement('img');
        var ratTag = document.createElement('img');
        var nameTag = document.createElement('a');
        var ratingTag = document.createElement('p');
        var ratsrc = '';
        imgTag.setAttribute('src', imgurl);
        nameTag.setAttribute('href', url);
        nameTag.innerText = name;
        ratingTag.innerText = "rating: " + rating + " / " + reviewcount + " times";
        ratsrc=rating.toString()+".png"
        ratTag.setAttribute('src', ratsrc);
        ratTag.setAttribute('id', "rimg");
        liTag.appendChild(imgTag);
        liTag.appendChild(nameTag);
        liTag.appendChild(ratTag);
        liTag.appendChild(ratingTag);
        document.getElementById('list').appendChild(liTag);
      });
      if (markersArray) {
        for (i in markersArray) {
          markersArray[i].setMap(map);
        }
      };

    }
  };
  xhr.send(null);
  document.getElementById('scroll').innerText = 'Scroll to view all';
};

function location1() {
  if (navigator.geolocation) {
    if (marker1) {
      marker1.setMap(null);
      marker1=null;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
      marker1 = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
      });
      marker1.setMap(map);
    });

  }
};
