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



app.post('/gossiping', (appreq, appres) => {
	
	var j = request.jar()
		var cookie = request.cookie('over18=1');
		var url = 'https://www.ptt.cc/bbs/Gossiping/index.html';
		j.setCookie(cookie, url, function (err, cookie){});
	
	request({url: url, jar: j}, (err, res, body) => {
		
		post.length = 0;
		list.length = 0;
		content.length = 0;
		
		
		var $ = cheerio.load(body)
		// 抓取文章列表
		list = $('.r-ent a').map((index, obj) => {
			if ( $(obj).text().match('搜尋同標題文章') == null ){
				if ( $(obj).text().match('搜尋看板內') == null ){
					if ( $(obj).text().match('[公告]111') == null ){
						if ( $(obj).text().match('[協尋]111') == null ){

							return {
							  title: $(obj).text(),
							  link: 'https://www.ptt.cc' + $(obj).attr('href'),
							}
						}
					}
				}
			}


		}).get()

		author = $('.author').map((index, obj) => {
			return {
				author: $(obj).text(),
			}

		}).get()

		date = $('.date').map((index, obj) => {
			return {
				date: $(obj).text(),
			}

		}).get()

		count = $('.r-ent .nrec').map((index, obj) => {
					return {
					  title: $(obj).text(),

					}
				}).get()


		//console.log(count);

		for(i=0;i<list.length;i++){

			post.push({
				title: list[i].title,
				author:author[i].author,
				date:date[i].date,
				count: count[i].title, 
				link: list[i].link,
			})

		}
		
	

		appres.send(post);
	});
	

	
});



app.post('/beauty', (appreq, appres) => {
	
	var j = request.jar()
		var cookie = request.cookie('over18=1');
		var url = 'https://www.ptt.cc/bbs/beauty/index.html';
		j.setCookie(cookie, url, function (err, cookie){});
	
	request({url: url, jar: j}, (err, res, body) => {
		
		post.length = 0;
		list.length = 0;
		content.length = 0;
		
		
		var $ = cheerio.load(body)
		// 抓取文章列表
		list = $('.r-ent a').map((index, obj) => {
			if ( $(obj).text().match('搜尋同標題文章') == null ){
				if ( $(obj).text().match('搜尋看板內') == null ){
					if ( $(obj).text().match('[公告]111') == null ){
						if ( $(obj).text().match('[協尋]111') == null ){

							return {
							  title: $(obj).text(),
							  link: 'https://www.ptt.cc' + $(obj).attr('href'),
							}
						}
					}
				}
			}


		}).get()

		author = $('.author').map((index, obj) => {
			return {
				author: $(obj).text(),
			}

		}).get()

		date = $('.date').map((index, obj) => {
			return {
				date: $(obj).text(),
			}

		}).get()

		count = $('.r-ent .nrec').map((index, obj) => {
					return {
					  title: $(obj).text(),

					}
				}).get()


		//console.log(count);

		for(i=0;i<list.length;i++){

			post.push({
				title: list[i].title,
				author:author[i].author,
				date:date[i].date,
				count: count[i].title, 
				link: list[i].link,
			})

		}
		
	

		appres.send(post);
	});
	

	
});


var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/post',urlencodedParser, (appreq, appres) => {
	console.log(appreq.body.name);
	var j = request.jar()
	var cookie = request.cookie('over18=1');
	var url = appreq.body.name;
	j.setCookie(cookie, url, function (err, cookie){});
	
	
	request({url: url, jar: j}, (err, res, body) => {
		
		var $ = cheerio.load(body);
		conlist = $('.article-meta-value').map((index, obj) => {
				
				return {
					title: $(obj).text(),

						
				}
			}).get()
		
		postcontent = $('#main-content').map((index, obj) => {
				return {
				  title: $(obj).text(),
				  
				}
			}).get()
		
		content.push({
				title: conlist[2].title,
				author: conlist[0].title,
			    date: conlist[3].title,
				content: postcontent[0].title,
		})
		
		
		appres.send(content);
		//console.log(content);
		content.length = 0;
	});
	
});




app.post('/movie', (appreq, appres) => {
	
		var j = request.jar()
		var cookie = request.cookie('over18=1');
		var url = 'https://www.ptt.cc/bbs/movie/index.html';
		j.setCookie(cookie, url, function (err, cookie){});
	
	request({url: url, jar: j}, (err, res, body) => {
		
		post.length = 0;
		list.length = 0;
		content.length = 0;
		
		
		var $ = cheerio.load(body)
		// 抓取文章列表
		list = $('.r-ent a').map((index, obj) => {
			if ( $(obj).text().match('搜尋同標題文章') == null ){
				if ( $(obj).text().match('搜尋看板內') == null ){
					if ( $(obj).text().match('[公告]111') == null ){
						if ( $(obj).text().match('[協尋]111') == null ){

							return {
							  title: $(obj).text(),
							  link: 'https://www.ptt.cc' + $(obj).attr('href'),
							}
						}
					}
				}
			}


		}).get()

		author = $('.author').map((index, obj) => {
			return {
				author: $(obj).text(),
			}

		}).get()

		date = $('.date').map((index, obj) => {
			return {
				date: $(obj).text(),
			}

		}).get()

		count = $('.r-ent .nrec').map((index, obj) => {
					return {
					  title: $(obj).text(),

					}
				}).get()


		//console.log(count);

		for(i=0;i<list.length;i++){

			post.push({
				title: list[i].title,
				author:author[i].author,
				date:date[i].date,
				count: count[i].title, 
				link: list[i].link,
			})

		}
		
	
	
		appres.send(post);
	});
	
	
	
	
});




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});