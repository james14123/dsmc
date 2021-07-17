const express = require('express');
var cloudflare = require('cloudflare-express');
const bodyParser = require('body-parser');
const app = express();
var cookieParser = require('cookie-parser');
const corsanywhere = 'https://cors-anywhere.herokuapp.com/';


app.use(cloudflare.restore({update_on_start:true}));
app.use(cookieParser());


var http = require("http");

var querystring = require("querystring");
var fs = require("fs");

var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
 
var server = http.createServer(function (req, res) {    
});
 

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
}

const corsOptions = {
  origin: [
    'https://dcarrd.000webhostapp.com',
    'https://dsmc-demo1.herokuapp.com/hotpost',
	  'https://dsmc-demo.herokuapp.com/hotpost',
	  'https://dsmc-demo.herokuapp.com/',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true })); 


var list = [];
var post = [];

app.post('/time', (appreq, appres) => {
	
	var content= []; 
	var url = "https://www.dcard.tw/_api/forums/"+appreq.body.name+"/posts";
	
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

app.post('/hot', (appreq, appres) => {
	
	var content= []; 
	var url = "https://www.dcard.tw/_api/forums/"+appreq.body.name+"/posts?popular=true";
	
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


app.post('/next', (appreq, appres) => {
	
	var content= []; 
	//console.log(appreq.body);
	if (appreq.body.fakename1 == "hotpost"){
		var url = "https://www.dcard.tw/_api/posts?popular=true&limit=30&before="+appreq.body.name;
	}else{
		var url = "https://www.dcard.tw/_api/forums/"+appreq.body.fakename1+"/posts?popular=false&limit=30&before="+appreq.body.name;
	}
		//console.log(url);

	
	
	//console.log(appreq.body.name);
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


app.post('/board', (appreq, appres) => {
	
	//console.log(appreq.body.name);
	
	
	var content= []; 
	var url = "https://www.dcard.tw/_api/forums/"+appreq.body.board+"/posts?popular=true";
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


app.post('/sex', (appreq, appres) => {
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


app.post('/animal_crossing', (appreq, appres) => {

	var content= []; 
	var url = "https://www.dcard.tw/_api/forums/animal_crossing/posts?popular=true";
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


app.post('/hotpost', (appreq, appres) => {
	
	var url = "https://dcard.tw/_api/posts?popular=true";
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
		
		;
		//console.log(list[0].Content);
		appres.send(list[0].Content);
		
	});
	
});





var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/post',urlencodedParser, (appreq, appres) => {
	
	var content= []; 
	var feedback = [];
	var j = request.jar()
	var j1 = request.jar()
	var cookie = request.cookie('over18=1');
	var url = "https://www.dcard.tw/_api/posts/"+appreq.body.name;
	var urlcomments = "https://www.dcard.tw/_api/posts/"+appreq.body.name+"/comments";
	
	j.setCookie(cookie, url, function (err, cookie){});
	
	request({url: url, jar: j}, (err, res, body) => {
		
		var $ = cheerio.load(body);
		conlist = $('body').map((index, obj) => {
				
				return {
					Content: $(obj).text(),
					
						
				}
			}).get()
		
		
		
		request({url: urlcomments, jar: j1}, (err, res, body) => {
		
		var $ = cheerio.load(body);
		conlistcomments = $('body').map((index, obj) => {
				
				return {
					commentsContent: $(obj).text(),

						
				}
			}).get()
			
		feedback.push({
			content1:JSON.parse(conlist[0].Content),
			content2:JSON.parse(conlistcomments[0].commentsContent)
		});
				
		appres.send(feedback[0]);
			
		feedback[0]="";	
			
		});
		
		
		
		
		
	});
	

	
});



const port = process.env.PORT || 3000;
//server.listen(5000); 
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});