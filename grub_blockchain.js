var jsdom = require('jsdom');
var url = require('url');

var blockchainUrl = 'https://blockchain.info/ru/tags';
jsdom.env({
  url: blockchainUrl,
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
