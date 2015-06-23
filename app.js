/*
     __  ___  _____     _   _____  __    
  /\ \ \/ __\ \_   \   /_\ /__   \/ _\   
 /  \/ / /     / /\/  //_\\  / /\/\ \    
/ /\  / /___/\/ /_   /  _  \/ /   _\ \   
\_\ \/\____/\____/   \_/ \_/\/    \__/   
                                         
*/

// **********************************************************
// app.js

console.log('NCI ATS - Agile BPA - FDA Recall Impact');

// **********************************************************
// require 

var http = require("http");
var https = require("https");
var url = require('url');
var express = require('express');
var js2xmlparser = require('js2xmlparser');
var path = require('path');
var fsr = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var server_api = require("./server/api.js");
var config_json = require('./config/config.json');
var package_json = require('./package.json');

// **********************************************************
// console start

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );

console.log('config_json.host : '+ config_json.app_host );
console.log('config_json.port : '+ config_json.app_port );

console.log('config_json.fda_host : '+ config_json.fda_host );
console.log('config_json.fda_key : '+ config_json.fda_key );

console.log('config_json.db_url : '+ config_json.db_url );

// **********************************************************
// log using morgan

var logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = fsr.getStream({
	filename: logDirectory + '/search-api-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

var app = express();

app.use(morgan('combined', {stream: accessLogStream}))

// **********************************************************

//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// **********************************************************
// route

app.use('/', express.static(__dirname + '/client'));

app.get('/api', function(req, res){
	server_api.requestSearch(req,res);
});

app.get('/api/search', function(req, res){
	server_api.requestSearch(req,res);
});

app.get('/api/search.:ext', function(req, res){
	server_api.requestSearch(req,res);
});

app.get('/api/filter', function(req, res){
	server_api.requestFilter(req,res);
});

app.get('/api/filter.:ext', function(req, res){
	server_api.requestFilter(req,res);
});

app.get('/api/crowd', function(req, res){
	server_api.requestCrowd(req,res);
});

app.get('/api/crowd.:ext', function(req, res){
	server_api.requestCrowd(req,res);
});

app.post('/api/crowd', function(req, res){
	server_api.insertCrowd(req,res);
});

app.post('/api/crowd.:ext', function(req, res){
	server_api.insertCrowd(req,res);
});

// **********************************************************
// error

app.use(function(req, res) {

	var err_res = {};
	
	err_res.responseStatus = {
		'status': 404,
		'type': 'Not Found',
		'err': req.url +' Not Found'		
	};	

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	res.status(404)
	.send(err_res);
	
});

app.use(function(err, req, res, next) {
	
	console.log('\n\n app.use error: ' + err );
	console.error(err.stack);
	
	var err_res = {};		
	err_res.responseStatus = {
		'status': 500,
		'type': 'Internal Server Error',
		'err': err.name +': '+ err.message		
	};	
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	res.status(500)
	.send(err_res);
});

process.on('uncaughtException', function (err) {
    console.log('\n\n uncaughtException: '+ err);
	console.error(err.stack);
});

// **********************************************************
// server

var server = app.listen(config_json.app_port, config_json.app_host, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;
