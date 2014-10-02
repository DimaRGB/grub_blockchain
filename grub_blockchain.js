var jsdom = require('jsdom');
var request = require('request');
var url = require('url');

var blockchainUrl = 'https://blockchain.info/ru/tags';
request({uri: blockchainUrl}, function(err, response, body) {
  var self = this;
	self.items = new Array(); //I feel like I want to save my results in an array
	//Just a basic error check
  if(err && response.statusCode !== 200)
  	console.log('Request error.');
  //Send the body param as the HTML code we will parse in jsdom
	//also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
	jsdom.env({
    html: body,
    scripts: ['http://code.jquery.com/jquery-latest.min.js'],
    done: function(err, window) {
		  //Use jQuery just as in a regular HTML page
	    var $ = window.jQuery;
	    var $table = $('.container>table');
	    var tbody = $table.find('tbody');
	    var trs = tbody.find('tr');
	    console.log($table.html());
	    console.log(trs.length);
	  }
	});
});
