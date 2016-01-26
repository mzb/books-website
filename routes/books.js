var express = require('express');
var request = require('good-guy-http')({
	maxRetries: 3,
	defaultCaching: {                                
		cached: true,                    
		timeToLive: 5000,                
		mustRevalidate: false             
	}
});
var json = require('jsonpath');

var router = express.Router();
var apiUrl = 'https://www.googleapis.com/books/v1/volumes';

router.get('/:isbn', function(req, res, next) {
	request({url: apiUrl, qs: {'q': 'isbn:' + req.params.isbn}, json: true})
		.then(function(reply) {
			if(json.query(reply, '$..totalItems') > 0) {
				var title = json.query(reply, '$..title');
				var cover = json.query(reply, '$..thumbnail');
				res.render('books', {cover: cover, title: title, partials: {layout: 'layout_file'}});
			} else {
				res.status(404).send('Book not found');
			}
		})
		.catch(next);
});

module.exports = router;
