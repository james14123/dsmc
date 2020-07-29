const express = require('express');
const bodyParser = require('body-parser');
const app = express();


var http = require("http");
var fs = require("fs");

var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors')

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); 




app.post('/hotpost', (appreq, appres) => {
	//console.log(appreq.body);
	var j = request.jar()
		var cookie = request.cookie('over18=1');
		var url = 'https://disp.cc/m/main';
		j.setCookie(cookie, url, function (err, cookie){});
	
	request({url: url, jar: j}, (err, res, body) => {
		
		
		var $ = cheerio.load(body)
		// 抓取文章列表
		list = $('.ht_title > a').map((index, obj) => {
			return {
					  title: $(obj).text(),	
			}
			

		}).get()
		
		console.log(list);
		appres.send(list);
	});
	
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});