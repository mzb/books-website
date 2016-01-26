var express = require('express');
var request = require('request-promise');

var router = express.Router();
var apiUrl = 'https://www.googleapis.com/books/v1/volumes';

router.get('/:isbn', function(req, res, next) {
	request({url: apiUrl, qs: {'q': 'isbn:' + req.params.isbn}, json: true})
		.then(function(reply) {
			if(reply.totalItems > 0) {
				var title = reply.items[0].volumeInfo.title;
				var cover = reply.items[0].volumeInfo.imageLinks.thumbnail;
				res.render('books', {cover: cover, title: title});
			} else {
				res.status(404).send('Book not found');
			}
		})
		.catch(next);
});

module.exports = router;
