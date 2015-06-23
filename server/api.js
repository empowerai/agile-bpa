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

var http = require("http");
var https = require("https");
var url = require('url');
var js2xmlparser = require('js2xmlparser');

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
// processSearch

function processSearch(json) {

	console.log('\n\n processSearch  ');	
	
	var process_json = json;	

	delete process_json.results[0]['@epoch'];
	delete process_json.results[0]['@id'];

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
	
	console.log('\n\n query : ' + query );
	console.log('\n\n filter : ' + filter );
	
	var request_fda = config_json.fda_protocol +'://'+ config_json.fda_host +'/'+ config_json.fda_path +'?api_key='+ config_json.fda_key;
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
				var response_out = secureJSON(json_data);
				
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
// processSearch

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
				var response_out = secureJSON(json_data);
				
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