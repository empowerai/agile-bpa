/*
     __  ___  _____     _   _____  __    
  /\ \ \/ __\ \_   \   /_\ /__   \/ _\   
 /  \/ / /     / /\/  //_\\  / /\/\ \    
/ /\  / /___/\/ /_   /  _  \/ /   _\ \   
\_\ \/\____/\____/   \_/ \_/\/    \__/   
                                         
*/

/* App developed for the Agile BPA by: NCI Information Systems, Inc. */ 

// **********************************************************
// ui.js

var map;
var markers;
var states;
var ready = false;

var q_food = '';
var q_state = '';
var q_date = '';
var q_class = '';
var q_status = '';

var data_json;
var selected_json;

var style_off = {
    fillColor: '#ffffff',
    fillOpacity: 0.0,
	color: '#ffffff',
    opacity: 0.0,
    weight: 1
};

var style_highlight_1 = {
    fillColor: '#00539B',
    fillOpacity: 0.5,
	color: '#00539B',
    opacity: 0.9,
    weight: 2
};
var style_highlight_2 = {
    fillColor: '#A3C658',
    fillOpacity: 0.5,
	color: '#A3C658',
    opacity: 0.9,
    weight: 2
};
var style_highlight_3 = {
    fillColor: '#E2C752',
    fillOpacity: 0.5,
	color: '#E2C752',
    opacity: 0.9,
    weight: 2
};

$(function() {
		
	// setup layers
	var open_osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Tiles <a href="http://wiki.openstreetmap.org/wiki/Tile_usage_policy" target="_blank">courtesy</a> <a href="https://www.openstreetmap.org/" target="_blank">OSM</a>'
	});
	var open_terrain = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
		subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],
		attribution: 'Tiles <a href="http://trc.gtrc.mapquest.com/web/products/open/map" target="_blank">courtesy</a> <a href="http://www.mapquest.com" target="_blank">MapQuest</a>'
	});
	var open_aerial = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
		subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],
		attribution: 'Tiles <a href="http://trc.gtrc.mapquest.com/web/products/open/map" target="_blank">courtesy</a> <a href="http://www.mapquest.com" target="_blank">MapQuest</a> | Imagery <a href="http://www.jpl.nasa.gov/" target="_blank">NASA</a>, <a href="http://www.fsa.usda.gov/" target="_blank">USDA</a>'
	});		
	var open_light = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: 'Tiles <a href="https://cartodb.com/basemaps" target="_blank">courtesy</a> <a href="https://cartodb.com/" target="_blank">CartoDB </a>'
	});		
	var open_dark = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
		attribution: 'Tiles <a href="https://cartodb.com/basemaps" target="_blank">courtesy</a> <a href="https://cartodb.com/" target="_blank">CartoDB</a>'
	});	
	var open_watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
		attribution: 'Tiles <a href="http://maps.stamen.com/" target="_blank">courtesy</a> <a href="http://stamen.com/" target="_blank">Stamen </a> '
	});		
	var open_toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		attribution: 'Tiles <a href="http://maps.stamen.com/" target="_blank">courtesy</a> <a href="http://stamen.com/" target="_blank">Stamen</a>'
	});		
	
	// setup map
	map = L.mapbox.map('map', open_light, {
		maxZoom: 15,
		attributionControl: false
	})
	.setView([40, -97], 3);
	
	// map attribution
	//map.attributionControl.setPrefix('');
	
	var infoControl = L.mapbox.infoControl();
	infoControl.addInfo('<a href="https://github.com/nci-ats/agile-bpa" target="_blank">Developed</a> by <a href="http://nciinc.com" target="_blank">NCI</a>');
	infoControl.addInfo('Map &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>');
	infoControl.addInfo('Data by <a href="https://open.fda.gov/" target="_blank">FDA</a>, <a href="http://geonames.usgs.gov/" target="_blank">USGS</a>, <a href="http://www.census.gov/" target="_blank">Census</a>');
	infoControl.addInfo('<a href="http://trc.gtrc.mapquest.com/web/products/open/nominatim" target="_blank">Search</a> by <a href="http://www.mapquest.com" target="_blank">MapQuest</a>');
	map.addControl(infoControl);
		
	// map controls
	L.control.scale({
		position: 'bottomleft'
	}).addTo(map);

	L.control.layers({
		'Street': open_light.addTo(map),
		//'Open Street Map': open_osm,
		'Terrain': open_terrain,
		'Satellite': open_aerial,		
		'Watercolor': open_watercolor,
		'Toner': open_toner,
		'Dark': open_dark
	}, 
	{},
	{
		position: 'topleft'
	}).addTo(map);
	 
	// current location
	$('#btn-geo-current').click(function(e) {
		getCurrentLocation(false);
		return false;
	});
	
	$('#input-geo-search').on('click', function(e) {
		e.preventDefault();

		var search_input = $('#input-geo-location').val();
	
		getGeocode(search_input);
	});

	$(document).keypress(function(e) {		
		if (e.which === 13) {
			var search_input = $('#input-geo-location').val();
			
			getGeocode(search_input);
		}
	});
	 
	// nationwide
	$('#btn-geo-nation').on('click', function() {
		setNationwide();
	});	
	
	// crowdsourced
	$('#btn-crowd-post').on('click', function() {	
		postCrowd(selected_json.recall_number);
	});	
	
	// get current location
	//getCurrentLocation(true);	
	
	// legend
	$('.btn-geo-legend').click(function(){ 
        $(this).hide();
        $('.legend').show('fast');
    });

    $('.btn-geo-legend-close').click(function() { 
        $('.legend').hide('fast');
        $('.btn-geo-legend').show();
    });
	
	// tooltips
	$('[data-toggle="tooltip"]').tooltip(); 
	
	// download
	$( '#download-data' ).click(function() {
		$( '#download-links' ).toggle();
	});

	// load markers
	loadMarkers();
	
	// load states
	states = L.mapbox.featureLayer()
		.loadURL('/data/state.geojson')		
		.on('ready', readyState);
		
	// load charts
	loadCharts();
	
});

function getGeocode(location) {

	var geocode_url = 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=1&countrycode=us&q='+ encodeURIComponent(location);
	//console.log('geocode_url : '+ geocode_url );	
	
	$.ajax({
		type: 'GET',
		url: geocode_url,
		dataType: 'json',
		success: function(data) {

			//console.log('geocode_url data : '+ JSON.stringify(data) );	
						
			// Nominatim Geocoder
			if (data[0]) {						
				
				var geo_bounds = data[0].boundingbox;
				
				map.fitBounds([
					[geo_bounds[0], geo_bounds[2]],
					[geo_bounds[1], geo_bounds[3]]
				]);				
			}
			else {
				window.alert('Search results not found.');
			}			
		},
		error: function (request, status, error) {
			
			window.alert('Search results not found.');
		}
	});	
}

function loadError() {
	$('#text-div-selected').hide();
	$('#text-div-national').hide();
	$('#text-div-noresults').show();
}

function searchMap(err, data) {
 
	var lat = data.latlng[0];
	var lon = data.latlng[1];

	if (data.lbounds) {
		map.fitBounds(data.lbounds);
	} else if (data.latlng) {
		map.setView([lat, lon], 12);
	}
 }

function getCrowd(recall) {
	
	var crowd_url = '/api/crowd.json?recall='+recall;	
	//console.log('crowd_url : '+ crowd_url);	
	$.ajax({
		type: 'GET',
		url: crowd_url,
		dataType: 'json',
		success: function(data) {

			//console.log('get data : '+ JSON.stringify(data) );	
			$('#api_population_crowd').text(data.results.recall_crowd_count);			
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});	
}

function postCrowd(recall) {
	
	var crowd_url = '/api/crowd.json?recall='+recall;	
	//console.log('crowd_url : '+ crowd_url);	
	$.ajax({
		type: 'POST',
		url: crowd_url,
		dataType: 'json',
		success: function(data) {

			//console.log('postdata : '+ JSON.stringify(data) );	
			$('#api_population_crowd').text(data.results.recall_crowd_count);
			
			//$('#api_population_crowd').css('font-size', '16px');
			$('.recall-users').css('color', '#E2C752');
			
			$('.recall-users').animate({			
				//fontSize: '13px',
				color: '#ffffff'
			}, 2000 );
			
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});	
}

function loadCharts() {
	
	var class_url = '/api/count.json?count=class&food='+q_food+'&state='+q_state+'&date='+q_date+'&class='+q_class+'&status='+q_status;	
	//console.log('class_url : '+ class_url);	
	$.ajax({
		type: 'GET',
		url: class_url,
		dataType: 'json',
		success: function(data) {

			//console.log('data : '+ JSON.stringify(data) );			
			setChartClass(data);
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});
	
	var status_url = '/api/count.json?count=status&food='+q_food+'&state='+q_state+'&date='+q_date+'&class='+q_class+'&status='+q_status;	
	//console.log('status_url : '+ status_url);	
	$.ajax({
		type: 'GET',
		url: status_url,
		dataType: 'json',
		success: function(data) {

			//console.log('data : '+ JSON.stringify(data) );			
			setChartStatus(data);
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});
	
	var date_url = '/api/count.json?count=date&food='+q_food+'&state='+q_state+'&date='+q_date+'&class='+q_class+'&status='+q_status;	
	//console.log('date_url : '+ date_url);	
	$.ajax({
		type: 'GET',
		url: date_url,
		dataType: 'json',
		success: function(data) {

			//console.log('data : '+ JSON.stringify(data) );			
			setChartDate(data);
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});
	
}

function setChartDate(data) {
	
	var date_arr = [];
	
	for (var i = 0; i < data.results.date_count.length; i++) {
	
		var this_date = data.results.date_count[i][0];
		var this_count = data.results.date_count[i][1];
		var format_date = Date.UTC(this_date.substring(0,4), this_date.substring(4,6), this_date.substring(6,8));
		
		date_arr.push([format_date, this_count]);
	}
	
	$('#chart-div-date').highcharts({
		colors: ['#00539B'],
		title: {
            text: 'Recall Dates',
        },
        chart: {
            zoomType: 'x'
        },
		credits: {
			enabled: false
		},
        xAxis: {
            type: 'datetime',
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: 'Number of Recalls'
            },
			min: 0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
		plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1.5
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        tooltip: {

        },
        series: [{
            type: 'area',
            name: 'Recalls',
            data: date_arr
        }]	
	
	});	
}

function setChartStatus(data) {

	$('#chart-div-status').highcharts({
		colors: ['#6699CC', '#99CCCC', '#323132'],
        chart: {
            type: 'bar',
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false
        },
        title: {
            text: 'Recall Status'
        },
		tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
            footerFormat: '</table>',
            //shared: true,
            useHTML: true
        },
		plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
		credits: {
			enabled: false
		},
        xAxis: {
            categories: ['']
        },
        yAxis: {
            title: {
                text: 'Recall Status'
            }
        },
        series: [{
            name: 'Ongoing',
            data: [data.results.ongoing]
        }, {
            name: 'Completed',
            data: [data.results.completed]
        }, {
            name: 'Terminated',
            data: [data.results.terminated]
        }]
	});		
}

function setChartClass(data) {

	$('#chart-div-class').highcharts({
        colors: ['#00539B', '#A3C658', '#E2C752'],
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Recall Severity'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		series: [{
			name: 'Recalls',
			colorByPoint: true,
			innerSize: '50%',
			data: [{
				name: 'Class I',
				y: data.results.class1
			}, {
				name: 'Class II',
				y: data.results.class2
			}, {
				name: 'Class III',
				y: data.results.class3
			}]
		}]
	});		
}

function readyState() {
	states.setStyle(style_off).addTo(map);
	ready = true;
}

function clearSelected() {

	$('#text-div-selected').hide();
	$('#text-div-national').show();
	$('#text-div-noresults').hide();
	
	if (ready) {
		states.setStyle(style_off);
	}
}

function highlightState(states_array, classification) {

	if (ready) {
		states.setStyle(style_off);
		
		states.eachLayer(function(layer) {			

			var layer_state = layer.feature.properties.STUSPS;	
			 
			var high_style = style_highlight_1;
			if (classification === 'Class I') {
				high_style = style_highlight_1;
			}
			else if (classification === 'Class II') {
				high_style = style_highlight_2;
			}
			else if (classification === 'Class III') {
				high_style = style_highlight_3;
			}
			
			if ($.inArray( layer_state, states_array ) >= 0) {
				layer.setStyle(high_style);
			}
			/*
			else {
				layer.setStyle(style_off);
			}
			*/		 
		});		
	}
}

$('#select_food').on('change', function() {
	q_food = $('#select_food').val();
	changeSearch();
});	

$('#select_state').on('change', function() {
	q_state = $('#select_state').val();
	changeSearch();	
});	

$('#select_date').on('change', function() {
	q_date = $('#select_date').val();
	changeSearch();
});	

$('#select_class').on('change', function() {
	q_class = $('#select_class').val();
	changeSearch();
});

$('#select_status').on('change', function() {
	q_status = $('#select_status').val();
	changeSearch();
});

function changeSearch() {
	
	clearSelected();
	setDownloadLinks();
	loadMarkers();	
	loadCharts();	
}

function loadMarkers() {
		
	var api_url = '/api/search.json?food='+q_food+'&state='+q_state+'&date='+q_date+'&class='+q_class+'&status='+q_status;
	
	//console.log('api_url : '+ api_url);
	
	$.ajax({
		type: 'GET',
		url: api_url,
		dataType: 'json',
		success: function(data) {

			//console.log('data : '+ JSON.stringify(data) );			
			data_json = data;
			
			setMarkers();
		},
		error: function (request, status, error) {
			//console.log(request.responseText);
			loadError();
		}
	});
}

function getIconColor(m_class) {
    var m_color = '#FAF75C';
    if (m_class === 'Class I') { m_color = '#00539B'; }
    if (m_class === 'Class II') { m_color = '#A3C658'; }
    if (m_class === 'Class III') { m_color = '#E2C752'; }
    
    return m_color;
}

function getIconSymbol(m_status) {
    var m_symbol = 'circle-stroked';
    if (m_status === 'Ongoing') { m_symbol = 'circle-stroked'; }
    if (m_status === 'Terminated') { m_symbol = 'cross'; }
    if (m_status === 'Completed') { m_symbol = 'circle'; }
    
    return m_symbol;
}

function setMarkers() {
	
	if (markers) {
		map.removeLayer(markers);
	}
	
	markers = L.mapbox.featureLayer();
	
	if (data_json.results) {	
		
		for (var i = 0; i < data_json.results.length; i++) {
		
			try {
				var m_lat = data_json.results[i].recall_location.lat;
				var m_lon = data_json.results[i].recall_location.long;
                
                var m_class = data_json.results[i].classification;
                var m_status = data_json.results[i].status;
                
				var m_size = 'medium';

				// set default recall
				/*
				if (i === data_json.results.length -1 ) {
					//console.log('data_json.results : '+ JSON.stringify(data_json.results[i]) );
					
					m_size = 'large';					
					selected_json = data_json.results[i];					
					selectResult();						
				}
				*/
				
                var m_icon = L.mapbox.marker.icon({
                    'marker-color': getIconColor(m_class),
                    'marker-size': m_size,
                    'marker-symbol': getIconSymbol(m_status)
                });

                //console.log('m_icon : '+ JSON.stringify(m_icon.options) );
				
				//var result_json = data_json.results[i];
				
				if ((m_lat !== 0) && (m_lon !== 0)) {
				
					//console.log('lat : '+ JSON.stringify(lat) );		
					
					var new_marker = L.marker([m_lat,m_lon], data_json.results[i])
						.on('click',function(e) {
						
							//console.log('this : '+ JSON.stringify(this.options) );
							
							selected_json = this.options;
                            
                            var c_class = selected_json.classification;
                            var c_status = selected_json.status;
                            
                            //console.log('c_class : '+ c_class );	
                            //console.log('c_status : '+ c_status );	
                            
                            markers.eachLayer(function(marker) {
                               
                                var reset_marker = marker.options.icon.options;                                
                               
                                reset_marker.iconSize = [30,70];
                                reset_marker.iconAnchor = [15,35];
                                reset_marker.popupAnchor = [0,-35];
                                
                                marker.setIcon(L.icon(
                                    reset_marker
                                ));
                                
                            });
                            
                            this.setIcon(L.mapbox.marker.icon({
                                'marker-color': getIconColor(c_class),
                                'marker-size': 'large',
                                'marker-symbol': getIconSymbol(c_status)
                            }));
                            
							selectResult();							
					
						});
                    
                    new_marker.setIcon(m_icon);
                    
						//.addTo(map);
						
					markers.addLayer(new_marker);
				}
			}
			catch(err) {			
			}
		}
		
		markers.addTo(map);		
	}
}

function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

function selectResult() {
	
	//console.log('selected_json : '+ JSON.stringify(selected_json) );	
	
	$('#text-div-selected').show();
	$('#text-div-national').hide();
	$('#text-div-noresults').hide();	
	
	$('#api_recall_number').text(selected_json.recall_number);
	$('#api_recalling_firm').text(selected_json.recalling_firm);
	$('#api_product_description').text(selected_json.product_description);
	$('#api_reason_for_recall').text(selected_json.reason_for_recall);
	
	$('#api_distribution_pattern').text(selected_json.distribution_pattern);
	$('#api_product_quantity').text(selected_json.product_quantity);
	
	var date_init = selected_json.recall_initiation_date;
	var date_format = new Date(date_init.substring(0,4)+'-'+date_init.substring(4,6)+'-'+date_init.substring(6,8));
	
	$('#api_recall_initiation_date').text(date_format.toLocaleDateString());
	$('#api_report_date').text(selected_json.report_date);
	$('#api_population_census').text(commaSeparateNumber(selected_json.affected_population_census));
	
	var pop_perc = (selected_json.affected_population_census / 322405453) * 100;
	//console.log('pop_perc : '+ pop_perc );	
	
	$('#api_population_percent').text( ( Math.round(pop_perc * 100) / 100) );
	
	highlightState(selected_json.affected_state, selected_json.classification);
	
	getCrowd(selected_json.recall_number);
    
	setStatusIcon(selected_json.status);
	setClassIcon(selected_json.classification);
		
	//$('#api_crowdsource').text(selected_json.api_recall_initiation_date);
}

function setDownloadLinks() {
	
	var download_qs = '';
	
	if (q_food) {
		if (download_qs) { download_qs += '&'; }
		else { download_qs += '?'; }
		download_qs += 'food='+q_food;
	}
	if (q_state) {
		if (download_qs) { download_qs += '&'; }
		else { download_qs += '?'; }
		download_qs += 'state='+q_state;
	}
	if (q_date) {
		if (download_qs) { download_qs += '&'; }
		else { download_qs += '?'; }
		download_qs += 'date='+q_date;
	}
	if (q_class) {
		if (download_qs) { download_qs += '&'; }
		else { download_qs += '?'; }
		download_qs += 'class='+q_class;
	}
	if (q_status) {
		if (download_qs) { download_qs += '&'; }
		else { download_qs += '?'; }
		download_qs += 'status='+q_status;
	}
	
	//console.log('download_qs : ' + download_qs);
	
	$('#download-json-link').attr('href', '/api/search.json'+ download_qs);
	$('#download-xml-link').attr('href', '/api/search.xml'+ download_qs);
	$('#download-csv-link').attr('href', '/api/search.csv'+ download_qs);
	
}

function setStatusIcon(status_i) {
	$('#api-status').text(status_i);
	
	if (status_i === 'Ongoing') { 
		$('#status-icon-img').attr('src','/image/circle-stroked-18.png'); 
		$('#api-status-span').prop('title', 'Ongoing - product recall is currently in progress').tooltip('fixTitle');
	}
    else if (status_i === 'Completed') { 
		$('#status-icon-img').attr('src', '/image/circle-18.png' ); 
		$('#api-status-span').prop('title', 'Completed - violative products have been retrieved/impounded').tooltip('fixTitle');
	}
    else if (status_i === 'Terminated') { 
		$('#status-icon-img').attr('src', '/image/cross-18.png' ); 
		$('#api-status-span').prop('title', 'Terminated - reasonable efforts have been made to remove/correct the product').tooltip('fixTitle');
	}
}

function setClassIcon(class_i) {
	$('#api-classification').text(class_i);
	
	$('#class-icon-i').removeClass( 'fda-blue fda-accent2 fda-accent3' );
		
    if (class_i === 'Class I') { 
		$('#class-icon-i').addClass( 'fda-blue' ); 
		$('#api-classification-span').prop('title', 'Class I - dangerous product that could cause serious health problems or death').tooltip('fixTitle');
	}
    else if (class_i === 'Class II') { 
		$('#class-icon-i').addClass( 'fda-accent2' ); 
		$('#api-classification-span').prop('title', 'Class II - defective product that could cause temporary health problems').tooltip('fixTitle');
	}
    else if (class_i === 'Class III') { 
		$('#class-icon-i').addClass( 'fda-accent3' ); 
		$('#api-classification-span').prop('title', 'Class III - unlikely to cause health problems but that violates labeling/manufacturing standards').tooltip('fixTitle');
	}	
}

function setNationwide() {		
	clearSelected();
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
				window.alert('Current location not found.');
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
			window.alert('Current location not found.');
		}
	}
	return false;
}
