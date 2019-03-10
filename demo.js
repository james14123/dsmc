 var express = require('express');
 var bodyParser = require('body-parser');
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
 var app = express();
var cors = require('cors')

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/test', function(req, res) {
    console.log(req.body.name);
	res.send(req.body.name);
    
});

var server = app.listen(8082, function() {
     console.log('Listening on port 8082');
 });