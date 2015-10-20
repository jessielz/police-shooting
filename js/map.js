var map;

// Function to draw your map
var drawMap = function() {

  // Create map and set view
	map = L.map('map').setView([41, -100], 4);

  // Create a tile layer variable using the appropriate url
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')

  // Add the layer to your map
 	layer.addTo(map);

  // Execute your function toe get data
  getData();
}

var data;

// Function for getting data
var getData = function() {

  // Execute an AJAX request to get the data in data/response.js
	$.ajax({
	  url: 'data/response.json',
	  type: "get",
	  success: function(response) {
	  	data = response;
	  	customBuild();
	  },
      dataType:"json"
	}); 
}

  // When your request is successful, call your customBuild function

// Loop through your data and add the appropriate layers and points

var customBuild = function() {
	
	// Be sure to add each layer to the map
	var hit = new L.LayerGroup([]);
	var kill = new L.LayerGroup([]);
	var maleKill = 0; 
	var femaleKill = 0;
	var maleHit = 0;
	var femaleHit = 0;

	for (i = 0; i < data.length; i++) {
		console.log(data[i]);
		var info = data[i];
		if (info["Hit or Killed?"] == "Killed") {
			if (info["Shots Fired"] != null) {
				var circle = new L.circleMarker([info.lat, info.lng], {color: 'red', radius: (info["Shots Fired"] * 0.5)});
			} else {
				var circle = new L.circleMarker([info.lat, info.lng], {color: 'red'});
			}
			if (info["Victim's Gender"] == "Male") {
				maleKill++;
			} else { 
				femaleKill++;
			}
			circle.addTo(kill); 			
		} else {
			if (info["Shots Fired"] != null)  {
				var circle = new L.circleMarker([info.lat, info.lng], {color: 'black', radius: (info["Shots Fired"] * 0.5)});
			} else {
				var circle = new L.circleMarker([info.lat, info.lng], {color: 'black'});
			}
			if (info["Victim's Gender"] == "Male") {
				maleHit++;
			} else {
				femaleHit++;
			}
			circle.addTo(hit);
		}
		circle.bindPopup(info["Summary"]);			
	}

	kill.addTo(map);
	hit.addTo(map)

	var overlayMaps = {
		"Hit" : hit,
		"Killed" : kill
	};

	$('#maleKill').html(maleKill);  
	$('#femaleKill').html(femaleKill);
	$('#maleHit').html(maleHit);
	$('#femaleHit').html(femaleHit);

	// Once layers are on the map, add a leaflet controller that shows/hides layers
	L.control.layers(null, overlayMaps).addTo(map);	
}