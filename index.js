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


var list = [];
var post = [];
var content= []; 

app.post('/', (appreq, appres) => {
	var url = "https://www.dcard.tw/_api/forums/sex/posts?popular=true";
	//var url = "https://dcard.tw/_api/posts?popular=true";
	request({url: url}, (err, res, body) => {
		var $ = cheerio.load(body)
		// 抓取文章列表
		//list = $('article > h2 > a> span').map((index, obj) 
		list = $('body').map((index, obj) => {
			return {
				Content: JSON.parse($(obj).text()),
			}
				
		}).get()
		
		//console.log("Test: "+list);
		appres.send(list[0].Content);
	});
	
});



var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/post',urlencodedParser, (appreq, appres) => {
	
	var j = request.jar()
	var cookie = request.cookie('over18=1');
	var url = appreq.body.name;
	j.setCookie(cookie, url, function (err, cookie){});
	
	
	request({url: url, jar: j}, (err, res, body) => {
		
		var $ = cheerio.load(body);
		conlist = $('body').map((index, obj) => {
				
				return {
					Content: $(obj).text(),

						
				}
			}).get()
		
		
		
		appres.send(JSON.parse(conlist[0].Content));
	});
	
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});