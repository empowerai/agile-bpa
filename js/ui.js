/*
     __  ___  _____     _   _____  __    
  /\ \ \/ __\ \_   \   /_\ /__   \/ _\   
 /  \/ / /     / /\/  //_\\  / /\/\ \    
/ /\  / /___/\/ /_   /  _  \/ /   _\ \   
\_\ \/\____/\____/   \_/ \_/\/    \__/   
                                         
*/

// **********************************************************
// ui.js

var map;

$(function() {
	
	// setup map
	L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6ImMyMzI0YTkyYWNkODg5NjkzZjU3NTEzNjdiZmI3ZWViIn0.P_biJ0yDpChjDr9XccH5Bg';
	map = L.mapbox.map('map', 'computech.j86bnb99', {
		maxZoom: 19
	})
	.setView([40, -97], 3);
	
	// map controls
	L.control.scale({
		position: 'bottomleft'
	}).addTo(map);
	
	map.attributionControl.addAttribution('<a href="http://nciinc.com">NCI Inc.</a>');
	
	var map_street = L.mapbox.tileLayer('computech.j86bnb99').addTo(map);
	var map_sat = L.mapbox.tileLayer('computech.jh7ic2j0');
	var map_topo = L.mapbox.tileLayer('computech.jh7ih1gk'); 

	L.control.layers({
		'Street': map_street.addTo(map),
		'Satellite': map_sat,
		'Terrain': map_topo
	}, 
	{},
	{
		position: 'topleft'
	}).addTo(map);
	 
	// geocoder
	geocoder = L.mapbox.geocoder('mapbox.places-v1');

	/*
	$("#input-loc-search").on("click", function(e) {
		e.preventDefault();
	});
	*/
	
	// current location
	$('#btn-geo-current').click(function(event) {
		getCurrentLocation(false);
		return false;
	});

	// nationwide
	$("#btn-geo-nation").on("click", function() {
		setNationwide();
	});	
	
	// get current location
	//getCurrentLocation(true);			
});

function setNationwide() {
	map.setView([40, -97], 3);
}

function getCurrentLocation(load) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;

			map.setView([lat, lon], 10);

		}, function(error) { 
			if (load) {	
				setNationwide();
			}
			else {
				alert('Current location not found.');
			}
		}, {
			timeout: 4000
		});
	} 
	else {
		if (load) {	
			setNationwide();
		}
		else {
			alert('Current location not found.');
		}
	}
	return false;
}












 

