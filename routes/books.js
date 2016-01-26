var express = require('express');
var request = require('request');

var router = express.Router();
var apiUrl = 'https://www.googleapis.com/books/v1/volumes';

router.get('/:isbn', function(req, res, next) {
	request(apiUrl + '?q=isbn:' + req.params.isbn, function(error, apiResp, body) {
		if(!error && apiResp.statusCode == 200) {
			var json = JSON.parse(body);
			var title = json.items[0].volumeInfo.title;
			var cover = json.items[0].volumeInfo.imageLinks.thumbnail;
			res.render('books', {cover: cover, title: title});
		} else {
			next(error);
		}
	});
});

module.exports = router;
