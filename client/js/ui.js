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

	// load markers
	loadMarkers();
	
});

var q_food = '';
var q_state = '';
var q_date = '';
var q_class = '';

var data_json;
var selected_json;

function loadMarkers() {
		
	var api_url = 'http://localhost:6479/api/search.json?food='+q_food+'&state='+q_state+'&date='+q_date+'&class='+q_class+'';
	
	console.log('api_url : '+ api_url);
	
	$.ajax({
		type: 'GET',
		url: api_url,
		dataType: 'json',
		success: function(data) {

			//console.log('data : '+ JSON.stringify(data) );
			
			data_json = data;
			
			setMarkers();

		}
	});

}

function setMarkers() {
	
	//console.log('data_json.results : '+ JSON.stringify(data_json.results) );
	
	if (data_json.results) {
	
		
		for (var i = 0; i < data_json.results.length; i++) {
		
			try {
				var lat = data_json.results[i].recall_location.lat;
				var lon = data_json.results[i].recall_location.long;
				
				var result_json = data_json.results[i];
				
				if ((lat != 0) && (lon != 0)) {
				
					//console.log('lat : '+ JSON.stringify(lat) );		
					
					L.marker([lat,lon], data_json.results[i])
						.on('click',function(e) {
						
							console.log('e.target._leaflet_id : '+ e.target._leaflet_id );
							console.log('this : '+ JSON.stringify(this.options) );
							
							selected_json = this.options;
							
							clickMarkers();							
					
						})
						.addTo(map);
				}
			}
			catch(err) {
			
			}
		}
	}

}

function clickMarkers() {
	
	console.log('selected_json : '+ JSON.stringify(selected_json) );
	
	
	$("#api_recall_number").text(selected_json.recall_number);
	$("#api_recalling_firm").text(selected_json.recalling_firm);
	$("#api_product_description").text(selected_json.product_description);
	$("#api_reason_for_recall").text(selected_json.reason_for_recall);
	$("#api_status").text(selected_json.status);
	$("#api_classification").text(selected_json.classification);
	$("#api_distribution_pattern").text(selected_json.distribution_pattern);
	$("#api_product_quantity").text(selected_json.product_quantity);
	$("#api_recall_initiation_date").text(selected_json.recall_initiation_date);
	$("#api_report_date").text(selected_json.report_date);
	$("#api_population_census").text(selected_json.affected_population_census);
	
	//$("#api_crowdsource").text(selected_json.api_recall_initiation_date);
}

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












 

