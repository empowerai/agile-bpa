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
var json_2_csv = require('json-2-csv');
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
                console.log('\n\n insertCrowd on error');	
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
                    console.log('\n\n insertCrowd res err ');	
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
                console.log('\n\n requestCrowd on error');	
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
                    console.log('\n\n requestCrowd res err ');	
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

    if(process_json.results){

	    for (var i = 0; i < process_json.results.length; i++) {
	        
	        result_json = process_json.results[i];
	        
	        delete result_json['@epoch'];
	        delete result_json['@id'];
	        
	        //result_json.affected_population_census = 746262;
	        
	        
	        //result_json.affected_population_crowd = getPopCrowd('def');
	    
	        
	        result_json.affected_state = ['AL','NY','MD','VA'];
	        result_json.recall_location = [85, -105];
	        
	        //console.log('\n\n result_json  ' + JSON.stringify(result_json));


	        var distribution_pattern = process_json.results[i].distribution_pattern;
		    //console.log('\distribution_pattern  ' + distribution_pattern);
		    
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
	var s_status = req.query.status;
   
    var search = '';
    
    if (s_food) {
        if (search != '') { search += '+AND+';}
        
        var food_search = s_food;

        if(s_food == 'dairy'){
        	food_search = "cream+milk+butter+chocolate";
        }
        else if(s_food == 'nuts'){
        	food_search = "peanut+almonds+pistachios+pine+walnuts+cashews+hazelnuts+pecans";
        }
        else if(s_food == 'dairy'){
        	food_search = "cream+milk+butter+chocolate";
        }
        else if(s_food == 'meat'){
        	food_search = "beef+chicken+pork";
        }
        else if(s_food == 'seafood'){
        	food_search = "oysters+fish+crabs+lobster";
        }
        else if(s_food == 'vegetables'){
        	food_search = "salad+herbs+squash+asparagus+broccoli+pepper+eggplant+zucchini";
        }
        else if(s_food == 'fruits'){
        	food_search = "apples+oranges+pears+grapes+peaches+strawberries+melon+cantaloupe";
        }

        search += '(product_description:'+ food_search +')';
    }
    if (s_date) {
        if (search != '') { search += '+AND+';}
       
        search += '(recall_initiation_date:['+ s_date +'-01-01+TO+'+ s_date +'-12-31])'; 
    }
	else {
		if (search != '') { search += '+AND+';}
		
		search += '(recall_initiation_date:[2010-01-01+TO+2015-12-31])'; 
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
	if (s_status) {
        if (search != '') { search += '+AND+';}       
        
        search += '(status:'+ s_status +')';                      
    }
	
    console.log('\n\n search : ' + search ); 
	
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
				
				var	process_data = processSearch(json_data);				
				

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
				
				console.log("count:"+process_data.results.length);

				process_data.counts = {
					'result_count': process_data.results.length
				}; 

				process_data.status = {
					'status': 200,
					'type': 'OK'
				};               
			
				// response_out		
				var response_out = secureJSON(process_data);

				if (ext == 'csv') {
                    
                    var csv_data = JSON.parse(response_out).results;
                    
                    console.log('\n\n csv_data : ' + csv_data );	

                    var header_array = new Array();	
					for (var i = 0; i < process_data.results.length; i++) {
						header_array.push(Object.keys(process_data.results)[i]);
    				}
                    
                    var csv_options = {
                        KEYS : ['recall_number', 'reason_for_recall', 'status', 'distribution_pattern', 'product_quantity', 'recall_initiation_date', 'state',
                               'event_id', 'product_type', 'product_description', 'country', 'city', 'recalling_firm', 'report_date', 'voluntary_mandated', 'classification', 
                               'code_info', 'initial_firm_notification', 'affected_state', 'recall_location', 'affected_population_census' ],
                        DELIMITER : {
                            WRAP : '"'
                        }
                    };
                    
                    json_2_csv.json2csv(csv_data, function(err, csv) {
                        
                        if (err) {
                            
                            console.log('\n\n requestSearch res csv err ');	
                            responseError(req, res, err);
                            return;
                            
                        }
                        else {
                            
                            //console.log('\n\n csv : ' + csv );	
                            
                            res.setHeader('Content-Type', 'text/csv');
                            
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					

                            res.send(csv);
                            console.log('\n\n res.send csv response_out ');	
                            return;
                        }

                    }, csv_options);
                     
				}
                else {
				
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
// requestCounts

function requestCounts(req, res) {

	console.log('\n\n requestCounts  ');

	var ext = req.params.ext;	
	console.log('\n\n ext : ' + ext );
	
	var query = req.query.q;
	var filter = req.query.f;
    
    var s_food = req.query.food;
    var s_date = req.query.date;
    var s_state = req.query.state;
    var s_class = req.query.class;
	var s_status = req.query.status;    	
   
    var search = '';
	
	var s_count = req.query.count;
	var count = '';
    
    if (s_food) {
        if (search != '') { search += '+AND+';}
        
        var food_search = s_food;

        if(s_food == 'dairy'){
        	food_search = "cream+milk+butter+chocolate";
        }
        else if(s_food == 'nuts'){
        	food_search = "peanut+almonds+pistachios+pine+walnuts+cashews+hazelnuts+pecans";
        }
        else if(s_food == 'dairy'){
        	food_search = "cream+milk+butter+chocolate";
        }
        else if(s_food == 'meat'){
        	food_search = "beef+chicken+pork";
        }
        else if(s_food == 'seafood'){
        	food_search = "oysters+fish+crabs+lobster";
        }
        else if(s_food == 'vegetables'){
        	food_search = "salad+herbs+squash+asparagus+broccoli+pepper+eggplant+zucchini";
        }
        else if(s_food == 'fruits'){
        	food_search = "apples+oranges+pears+grapes+peaches+strawberries+melon+cantaloupe";
        }

        search += '(product_description:'+ food_search +')';
    }
    if (s_date) {
        if (search != '') { search += '+AND+';}
       
        search += '(recall_initiation_date:['+ s_date +'-01-01+TO+'+ s_date +'-12-31])'; 
    }
	else {
		if (search != '') { search += '+AND+';}
		
		search += '(recall_initiation_date:[2010-01-01+TO+2015-12-31])'; 
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
	if (s_status) {
        if (search != '') { search += '+AND+';}       
        
        search += '(status:'+ s_status +')';                      
    }

    if (s_count == 'date'){
		count = 'recall_initiation_date';                      
    }
    else if (s_count == 'status') {
    	count = 'status';
    }
    else {
    	count = 'classification';	
    }
	
    console.log('\n\n count : ' + count );   
	console.log('\n\n search : ' + search ); 
	
	var request_fda = config_json.fda_protocol +'://'+ config_json.fda_host +'/'+ config_json.fda_path +'?api_key='+ config_json.fda_key +'&limit=500&count='+ count +'&search='+ search;
	console.log('\n\n request_fda : ' + request_fda );	
	
	https.get(request_fda, function (http_res) {
		var data = '';	
		http_res.on("data", function (chunk) {
			data += chunk;
		});

		http_res.on("end", function () {				
			
			try {
			
				var json_data = JSON.parse(data);				
				
				var	process_data = processCounts(json_data, s_count);				
				
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
				
				console.log("count:"+process_data.results.length);

				process_data.status = {
					'status': 200,
					'type': 'OK'
				};               
			
				// response_out		
				var response_out = secureJSON(process_data);

				if (ext == 'csv') {
                    
                    var csv_data = JSON.parse(response_out).results;
                    
                    console.log('\n\n csv_data : ' + csv_data );

                    var header_array = new Array();	
					for (var i = 0; i < process_data.results.length; i++) {
						header_array.push(Object.keys(process_data.results)[i]);
    				}
                    
                    var csv_options = {
                        KEYS : header_array.toString(),
                        DELIMITER : {
                            WRAP : '"'
                        }
                    };
                    
                    json_2_csv.json2csv(csv_data, function(err, csv) {
                        
                        if (err) {
                            
                            console.log('\n\n requestSearch res csv err ');	
                            responseError(req, res, err);
                            return;
                            
                        }
                        else {
                            
                            //console.log('\n\n csv : ' + csv );	
                            
                            res.setHeader('Content-Type', 'text/csv');
                            
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");					

                            res.send(csv);
                            console.log('\n\n res.send csv response_out ');	
                            return;
                        }

                    }, csv_options);
                     
				}
                else {
				
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
			}
			catch (err) {
				console.log('\n\n requestCounts res err ');	
				responseError(req, res, err);
				return;
			}			
		});
		
	}).on("error", function(err){		
		console.log('\n\n requestCounts on error');	
		responseError(req, res, err);
		return;
	});
};

function processCounts(json, type) {

	console.log('\n\n processCounts  ');
	
	var process_json = json;	
    
    var result_json;

    var location;

    var class1 = 0;
    var class2 = 0;
    var class3 = 0;

    var return_json = {};

    //return_json.meta = process_json.meta;

    if(type=='class'){
    	if(process_json.results){
	    	for (var i = 0; i < process_json.results.length; i++) {
	        
		        result_json = process_json.results[i];
		       
		        console.log('\n\n result_json. term: ' + result_json.term);
		        console.log('\n\n result_json  count: ' + result_json.count);
				
				if(result_json.term=='i'){
					class1 = result_json.count;
				}
				else if(result_json.term=='ii'){
					class2 = result_json.count;
				}
				else if(result_json.term=='iii'){
					class3 = result_json.count;
				}
		    }
	    }
		return_json.results = {
			'class1': class1,
			'class2': class2,
			'class3': class3	
		};
    }
    else if(type=='status'){
    	if(process_json.results){
	    	for (var i = 0; i < process_json.results.length; i++) {
	        
		        result_json = process_json.results[i];
		       
		        console.log('\n\n result_json. term: ' + result_json.term);
		        console.log('\n\n result_json  count: ' + result_json.count);
				
				if(result_json.term=='ongoing'){
					class1 = result_json.count;
				}
				else if(result_json.term=='terminated'){
					class2 = result_json.count;
				}
				else if(result_json.term=='completed'){
					class3 = result_json.count;
				}
		    }
	    }
		return_json.results = {
			'ongoing': class1,
			'terminated': class2,
			'completed': class3	
		};
    }
    else if(type=='date'){
    	var date_array = [];
    	var count_array = [];
    	var date_count_array = [];
		
		if(process_json.results){
	    	for (var i = 0; i < process_json.results.length; i++) {
	    		//console.
	    		//return_json = process_json.results[i];
	    		date_array.push(process_json.results[i].time);
				count_array.push(process_json.results[i].count);
				
				date_count_array.push([process_json.results[i].time, process_json.results[i].count]);
				
	    	}
						
			date_count_array.sort(sortFunction);			
	    }	
    	//console.log("date_array="+date_array);
    	//console.log("count_array="+count_array);

    	return_json.results = {
			'date_count': date_count_array
			//'date': date_array,
			//'count': count_array
		};
    }    
    
	return return_json;
}

function sortFunction(a, b) {
	if (a[0] === b[0]) {
		return 0;
	}
	else {
		return (a[0] < b[0]) ? -1 : 1;
	}
}

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
exports.requestCounts = requestCounts;
exports.requestCrowd = requestCrowd;
exports.insertCrowd = insertCrowd;
