var jsdom = require('jsdom');
var request = require('request');
var fs = require('fs');

var tagsUrl = 'https://blockchain.info/ru/tags';

function sendRequest(url, callback) {
	console.log('Send request: ' + url);
	request(url, function(err, response, body) {
		if( err || response.statusCode !== 200 ) {
			console.log('Response error: ' + response.statusCode);
			sendRequest(url, callback);
		} else
			jsdom.env({
				html: body,
				scripts: ['./jquery-1.11.1.min.js'],
				done: function(err, window) {
					if( err ) {
						console.log('Error: ' + err);
						sendRequest(url, callback);
					} else {
						console.log('Success: ' + window.jQuery);
						callback(window.jQuery);
					}
				}
			});
	});
}


var tags = [], offset = 0, offsetSize, offsetMax;

function addTable($) {
	$('table').find('tbody').find('tr').each(function () {
		$tr = $(this);
		$tds = $tr.find('td');
		$address = $($tds[0]).children();
		$tag = $($tds[1]).children();
		$link = $($tds[2]).children();
		$verified = $($tds[3]).children();
		tags.push({
			address: $address.text(),
			tag: $tag.text(),
			link: $link.text(),
			verified: $verified.attr('src') == '/Resources/green_tick.png'
		});
	});
}

function grubPageNext($, finishBack) {
	console.log(offset, offsetMax);
	offset += offsetSize;
	console.log(offset, offsetMax);
	if( offset < offsetMax )
		sendRequest(tagsUrl + '?offset=' + offset, function ($) {
			addTable($);
			grubPageNext($, finishBack);
		});
	else
		finishBack();
}

sendRequest(tagsUrl, function ($) {
	offsetSize = +$('table').find('tbody').find('tr').length;
	offsetMax = +$('.pagination').find('li').last().prev().find('a').attr('href').split('?offset=')[1];
	addTable($);
	grubPageNext($, function () {
		console.log('Tags length: ' + tags.length);
		var fileContent = JSON.stringify(tags, null, 4);
		fs.writeFile('blockcain_' + (new Date).getTime() + '.json', fileContent, function(err) {
	    if( err )
        console.log(err);
	    else
      	console.log('The file was saved!');
		});
	});
});
