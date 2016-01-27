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
var ESI = require('nodesi');

var router = express.Router();
var bookApiUrl = 'https://www.googleapis.com/books/v1/volumes';
var stockApiUrl = process.env.STOCK_API_URL || 'http://mb-book-inventory-test.herokuapp.com';
var esi = new ESI();

router.get('/:isbn', function(req, res, next) {
	request({url: bookApiUrl, qs: {'q': 'isbn:' + req.params.isbn}, json: true})
		.then(function(reply) {
			return new Promise(function(resolve, reject) {
				if(json.query(reply, '$..totalItems') > 0) {
					var title = json.query(reply, '$..title');
					var cover = json.query(reply, '$..thumbnail');
					req.app.render('books', {
						cover: cover, 
						title: title, 
						isbn: req.params.isbn, 
						requestId: req.headers['x-request-id'],
						stockApiUrl: stockApiUrl,
						partials: {layout: 'layout_file'}
					}, function(err, html) {
						if(err) reject(err);
						else resolve(html);
					});
				} else {
					var err = new Error('Book not found');
					err.status = 404;
					reject(err);
				}
			});
		})
		.then(function(html) {
			return esi.process(html, {
				headers: {
					'X-Request-ID': req.headers['x-request-id']
				}
			});
		})
		.then(function(html) {
			return res.send(html);
		})
		.catch(next);
});

module.exports = router;
