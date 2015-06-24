/*
     __  ___  _____     _   _____  __    
  /\ \ \/ __\ \_   \   /_\ /__   \/ _\   
 /  \/ / /     / /\/  //_\\  / /\/\ \    
/ /\  / /___/\/ /_   /  _  \/ /   _\ \   
\_\ \/\____/\____/   \_/ \_/\/    \__/   
                                         
*/

// **********************************************************
// api.js

'use strict';

var config_json = require('../config/config.json');
var package_json = require('../package.json');

var state_pop_json = require('../data/state_pop.json');
var places_json = require('../data/gnis_places.json');

var http = require("http");
var https = require("https");
var url = require('url');
var js2xmlparser = require('js2xmlparser');
var moment = require('moment');
var pg = require('pg');

// **********************************************************
//database

var conString = config_json.db_url; 
var client = new pg.Client(conString);
client.connect();

// **********************************************************
// secureJSON

function secureJSON(json) {
	
	console.log('\n\n secureJSON  ');

	var secure_json = json;
	if (typeof secure_json == 'object') {
		secure_json = JSON.stringify(json);
	}

	secure_json = secure_json.replace(/[<>]/g, ' ');	
	return secure_json;
}

// **********************************************************
// insertCrowd

function insertCrowd(req, res) {

	console.log('\n\n insertCrowd ');

	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
    
    var r_recall = req.query.recall;
    
    if (r_recall) {
        
        var curr_time = moment().format('YYYY/MM/DD HH:MM');
        console.log('\n\n curr_time : ' + curr_time );
        
        var i_query = "INSERT INTO fda_demo.affected_crowdsource_input (input_datetime, fda_recall_number) VALUES ('"+ curr_time +"', '"+ r_recall +"'); "+
            "SELECT COUNT(*) FROM fda_demo.affected_crowdsource_input WHERE fda_recall_number = '"+ r_recall +"' AND input_status = 'y'; ";
        
        console.log('\n\n i_query : ' + i_query );
        
        client.query(i_query, function(err, result) {

            if (err) {
                console.log('\n\n requestSearch on error');	
                responseError(req, res, err);
                return;
            }

            try {
                    var crowd_count = result.rows[0].count;

                    var process_data = {
                        meta: {},
                        results: {
                            recall_number: r_recall,
                            recall_crowd_count: crowd_count
                        }
                    };


                    if (process_data.meta) {
                        process_data.meta.name = package_json.name;
                        process_data.meta.description = package_json.description;
                        process_data.meta.version = package_json.version;
                    }

                    process_data.status = {
                        'status': 200,
                        'type': 'OK'
                    };               

                    // response_out		
                    var response_out = secureJSON(process_data);

                    if (ext == 'xml') {
                        response_out = js2xmlparser('api', response_out);
                        res.setHeader('Content-Type', 'text/xml');
                    }

                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					

                    res.send(response_out);
                    console.log('\n\n res.send response_out ');	
                    return;
                }
                catch (err) {
                    console.log('\n\n requestSearch res err ');	
                    responseError(req, res, err);
                    return;
                }	

            for (var i = 0; i < result.rows.length; i++) {
                console.log("my result="+JSON.stringify(result.rows[i]));
                console.log("count="+JSON.stringify(result.rows[i].count));

                return result.rows[i].count;

            }
        });

    }
};


// **********************************************************
// requestCrowd

function requestCrowd(req, res) {

	console.log('\n\n requestCrowd  ');

	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
    
    var r_recall = req.query.recall;
    
    if (r_recall) {
        
        var r_query = "SELECT COUNT(*) FROM fda_demo.affected_crowdsource_input WHERE fda_recall_number = '"+ r_recall +"' AND input_status = 'y'; ";
        
        console.log('\n\n r_query : ' + r_query );
        
        client.query(r_query, function(err, result) {

            if (err) {
                console.log('\n\n requestSearch on error');	
                responseError(req, res, err);
                return;
            }

            try {
                    var crowd_count = result.rows[0].count;

                    var process_data = {
                        meta: {},
                        results: {
                            recall_number: r_recall,
                            recall_crowd_count: crowd_count
                        }
                    };


                    if (process_data.meta) {
                        process_data.meta.name = package_json.name;
                        process_data.meta.description = package_json.description;
                        process_data.meta.version = package_json.version;
                    }

                    process_data.status = {
                        'status': 200,
                        'type': 'OK'
                    };               

                    // response_out		
                    var response_out = secureJSON(process_data);

                    if (ext == 'xml') {
                        response_out = js2xmlparser('api', response_out);
                        res.setHeader('Content-Type', 'text/xml');
                    }

                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					

                    res.send(response_out);
                    console.log('\n\n res.send response_out ');	
                    return;
                }
                catch (err) {
                    console.log('\n\n requestSearch res err ');	
                    responseError(req, res, err);
                    return;
                }	

            for (var i = 0; i < result.rows.length; i++) {
                console.log("my result="+JSON.stringify(result.rows[i]));
                console.log("count="+JSON.stringify(result.rows[i].count));

                return result.rows[i].count;

            }
        });

    }
};

// **********************************************************
// processSearch

function processSearch(json) {

	console.log('\n\n processSearch  ');
	
	var process_json = json;	
    
    var result_json;

    var location;

    for (var i = 0; i < process_json.results.length; i++) {
        
        result_json = process_json.results[i];
        
        delete result_json['@epoch'];
        delete result_json['@id'];
        
        //result_json.affected_population_census = 746262;
        
        
        //result_json.affected_population_crowd = getPopCrowd('def');
    
        
        result_json.affected_state = ['AL','NY','MD','VA'];
        result_json.recall_location = [85, -105];
        
        console.log('\n\n result_json  ' + JSON.stringify(result_json));


        var distribution_pattern = process_json.results[i].distribution_pattern;
	    console.log('\distribution_pattern  ' + distribution_pattern);
	    
	    var total_pop = 0;
	    
     	var match_array = new Array();
     	if(distribution_pattern.toLowerCase().indexOf("nation")!=-1){
     		for (var k in state_pop_json.state_pop) {
     			match_array.push(k);
	            total_pop = total_pop + parseFloat(state_pop_json.state_pop[k].pop);
     		}
     	}
     	else {
     		for (var k in state_pop_json.state_pop) {
				//console.log(k+","+JSON.stringify(state_pop_json.state_pop[k].pop));
				if(distribution_pattern.indexOf(k)!=-1){
	            	match_array.push(k);
	            	total_pop = total_pop + parseFloat(state_pop_json.state_pop[k].pop);
	           	}
	           	
	           	if(distribution_pattern.indexOf(state_pop_json.state_pop[k].name)!=-1){
	            	match_array.push(k);
	            	total_pop = total_pop + parseFloat(state_pop_json.state_pop[k].pop);
	           	}
			}	
     	}
		
		location = process_json.results[i].city.concat(",").concat(process_json.results[i].state);
		//console.log("location="+location);
		//console.log("match_array="+match_array);
		//console.log("total_pop="+total_pop);
	    result_json.affected_population_census = total_pop;
	    result_json.affected_state = match_array;
	    result_json.recall_location = places_json.gnis_places[location];

        
        process_json.results[i] = result_json;
    }

	return process_json;
}

// **********************************************************
// requestSearch

function requestSearch(req, res) {

	console.log('\n\n requestSearch  ');

	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
	
	var query = req.query.q;
	var filter = req.query.f;
    
    var s_food = req.query.food;
    var s_date = req.query.date;
    var s_state = req.query.state;
    var s_class = req.query.class;
    
    var search = '';
    
    if (s_food) {
        if (search != '') { search += '+AND+';}
        search += '(product_description:'+ s_food +')';                      
    }
    if (s_date) {
        if (search != '') { search += '+AND+';}
        
        /*
        var s_date_start, s_date_end, s_date_range;
        
        s_date_end = moment().format('YYYY-MM-DD');
        
        if (s_date == 'week') {
            s_date_start = moment().subtract('days', 7).format('YYYY-MM-DD');   
        }
        else if (s_date == 'month') {
            s_date_start = moment().subtract('months', 1).format('YYYY-MM-DD');   
        }
        else if (s_date == 'quarter') {
            s_date_start = moment().subtract('months', 3).format('YYYY-MM-DD');    
        }
        else if (s_date == 'year') {            
            s_date_start = moment().subtract('years', 1).format('YYYY-MM-DD');   
        }

        s_date_range = s_date_start +'+TO+'+ s_date_end;
        
        search += '(recall_initiation_date:['+ s_date_range +'])'; 
        */
        
        search += '(recall_initiation_date:['+ s_date +'-01-01+TO+'+ s_date +'-12-31])'; 
    }
    if (s_state) {
        if (search != '') { search += '+AND+';}
        //search += '(state:'+ s_state +')';  
        search += '(distribution_pattern:'+ s_state +'+'+ state_pop_json.state_pop[s_state].name +')';  
    }
    if (s_class) {
        if (search != '') { search += '+AND+';}
        
        var s_class_i = '';
        for (var i = 0; i < s_class; i++) {
            s_class_i += 'I';
        }
        
        search += '(classification:'+ s_class_i +')';                      
    }
	
    console.log('\n\n search : ' + search );    
        
	console.log('\n\n query : ' + query );
	console.log('\n\n filter : ' + filter );
	
	var request_fda = config_json.fda_protocol +'://'+ config_json.fda_host +'/'+ config_json.fda_path +'?api_key='+ config_json.fda_key +'&limit=100&search='+ search;
	console.log('\n\n request_fda : ' + request_fda );	
	
	https.get(request_fda, function (http_res) {
		var data = '';	
		http_res.on("data", function (chunk) {
			data += chunk;
		});

		http_res.on("end", function () {				
			
			try {
			
				var json_data = JSON.parse(data);				
				var process_data = processSearch(json_data);				

				if (process_data.error) {
					var err_msg = 'requestSearch process error';
					responseError(req, res, err_msg);
					return;
				} 
				
				if (process_data.meta) {
					process_data.meta.name = package_json.name;
					process_data.meta.description = package_json.description;
					process_data.meta.version = package_json.version;
				}
				
				process_data.status = {
					'status': 200,
					'type': 'OK'
				};               
			
				// response_out		
				var response_out = secureJSON(process_data);
				
				if (ext == 'xml') {
					response_out = js2xmlparser('api', response_out);
					res.setHeader('Content-Type', 'text/xml');
				}
				
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					
				
				res.send(response_out);
                console.log('\n\n res.send response_out ');	
				return;
			}
			catch (err) {
				console.log('\n\n requestSearch res err ');	
				responseError(req, res, err);
				return;
			}			
		});
		
	}).on("error", function(err){		
		console.log('\n\n requestSearch on error');	
		responseError(req, res, err);
		return;
	});
};

// **********************************************************
// processFilter

function processFilter(json) {

	console.log('\n\n processFilter  ');	
	
	var process_json = json;	
	
	/*
	for (var k in process_json) {	
		console.log('\n\n k : ' + k );
		console.log('\n\n process_json[k] : ' + process_json[k] );		
	}
	*/
	
	console.log('\n\n process_json.results.length : ' + process_json.results.length );
	var normalize_arr = [];
	for (var i = 0; i < process_json.results.length; i++) {	
		//console.log('\n\n i : ' + i );
		//console.log('\n\n process_json.results[i] : ' + JSON.stringify( process_json.results[i] ) );	
		
		if (process_json.results[i].term.length < 4) {		
			// less than 4 char
		}
		else if ((process_json.results[i].term == 'product') || (process_json.results[i].term == 'packaged') || (process_json.results[i].term == 'distributed') || (process_json.results[i].term == 'with')) {		
			// stop words
		}
		else if ( !isNaN(process_json.results[i].term) ) {
			// number
		}
		else {
			normalize_arr.push(process_json.results[i]);
		}
		
		//console.log('\n\n normalize_arr : ' + JSON.stringify( normalize_arr ) );
	}
	
	process_json.results = normalize_arr;	

	return process_json;
}

// **********************************************************
// requestSearch

function requestFilter(req, res) {

	console.log('\n\n requestFilter  ');

	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
	
	var query = req.query.q;
	var filter = req.query.f;
	
	console.log('\n\n query : ' + query );
	console.log('\n\n filter : ' + filter );
	
	var request_fda = config_json.fda_protocol +'://'+ config_json.fda_host +'/'+ config_json.fda_path +'?api_key='+ config_json.fda_key +'&limit=1000&count=product_description';
	console.log('\n\n request_fda : ' + request_fda );	
	
	https.get(request_fda, function (http_res) {
		var data = '';	
		http_res.on("data", function (chunk) {
			data += chunk;
		});

		http_res.on("end", function () {				
			
			try {
			
				var json_data = JSON.parse(data);				
				var process_data = processFilter(json_data);				

				if (process_data.error) {
					var err_msg = 'requestFilter process error';
					responseError(req, res, err_msg);
					return;
				} 
				
				if (process_data.meta) {
					process_data.meta.name = package_json.name;
					process_data.meta.description = package_json.description;
					process_data.meta.version = package_json.version;
				}
				
				process_data.status = {
					'status': 200,
					'type': 'OK'
				};               
			
				// response_out		
				var response_out = secureJSON(process_data);
				
				if (ext == 'xml') {
					response_out = js2xmlparser('api', response_out);
					res.setHeader('Content-Type', 'text/xml');
				}
				
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					
				
				res.send(response_out);
				return;
			}
			catch (err) {
				console.log('\n\n requestFilter res err ');	
				responseError(req, res, err);
				return;
			}			
		});
		
	}).on("error", function(err){		
		console.log('\n\n requestFilter on error');	
		responseError(req, res, err);
		return;
	});
};

// **********************************************************
// responseError

function responseError(req, res, err) {
	
	console.log('\n\n responseError ');	
	console.error(err.stack);
	
	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
	
	var err_mess = err;
	if (typeof err_mess == 'object') {
		err_mess = err.name +': '+ err.message;
	}
	
	var err_res = {};
	err_res.status = {
		'status': 400,
		'type': 'Bad Request',
		'err': err_mess	
	};	
	
	// response_out		
	var response_out = secureJSON(err_res);

	if (ext == 'xml') {
		response_out = js2xmlparser('api', response_out);
		res.setHeader('Content-Type', 'text/xml');
	}

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					

	res.status(400);
	res.send(response_out);
	return;	
}

// **********************************************************
// exports

exports.requestSearch = requestSearch;
exports.requestFilter = requestFilter;
exports.requestCrowd = requestCrowd;
exports.insertCrowd = insertCrowd;