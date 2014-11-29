
var fs = require('fs'),
	request = require('./request'),
	cookieUtil = require('cookie'),
	path = require('path'),
	cheerio = require('cheerio');

var ipsPath = path.join(__dirname, 'ips');
var goodPath = path.join(__dirname, 'good_ips');
var cookiePath = path.join(__dirname, 'cookies');

var goodIPs = [];

function find () {
	// return ['58.123.102.99','203.116.165.138','173.194.121.28','61.19.1.118'];
	var da = fs.readFileSync(ipsPath, {encoding: 'utf8'});
	da = da.split('\n');
	return da;
}

function check () {
	var ips = find();
	var isSetCookie = false;
	var index = 0, total = ips.length;
	for (var i = 0; i < total; i++) {
		(function (ip) {
		    var cookie = 'PREF=ID=b9e1a15e9b81e6cc:U=22d7bb48e5287641:FF=0:TM=1417225181:LM=1417225181:S=8DqUrQ65ZYdnZc7b';
		    if (fs.existsSync(cookiePath)) {
		    	cookie = fs.readFileSync(cookiePath, {encoding: 'utf8'});
		    }
		    var headers = {
		        'accept-language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
		        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
		        	'(KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
		        'cookie': cookie
		    };

		    var url = 'http://'+ip;
		    var timeout = 800;
		    var options = {
		        url: url+'/search',
		        headers: headers,
		        timeout: timeout,
		        qs: {
		        	ie: 'utf-8',//输入编码
		        	oe: 'utf-8',//输出编码, 否则ua被篡改为无效后会导致搜索结果乱码
		        	q: 'nginx',
		        	hl: 'zh_CN'
		        }
		    };
		    var startTime = new Date().getTime();
		    console.log("request: " + ip);
		    request(options, function (err, res, body) {
		        if (!err) {
		        	var useTime = new Date().getTime() - startTime;
		        	console.log(url + ": " + useTime + "ms");
				var $ = cheerio.load(body);
				var search = $("#search").find("li.g");
				console.log(url+": " + search.length);
				if (search.length >= 7 && useTime <= timeout) {
					fs.writeFileSync(goodPath, ip+"\n", {encoding: 'utf8', flag: 'a'});
				}
				if (!isSetCookie) {
					var cookies = res.headers['set-cookie'];
					var cookieArr = [];
					if (cookies && cookies.length > 0) {
					    for (var i = 0; i < cookies.length; i++) {
					        var cookieItem = cookieUtil.parse(cookies[i]);
					        if (cookieItem.domain) {
					            delete cookieItem.domain;
					        }
					        if (cookieItem.path) {
					            delete cookieItem.path;
					        }
					        if (cookieItem.expires) {
					            delete cookieItem.expires;
					        }

					        var tempArr = [];
					        for (var key in cookieItem) {
					            tempArr.push(key+'='+cookieItem[key]);
					        }
					        cookieArr.push(tempArr.join('; '));
					    }
					    var cookieStr = cookieArr.join('; ');
					    console.log(cookieStr);
					    fs.writeFileSync(cookiePath, cookieStr, {encoding: 'utf8', flag: 'w'});
					    isSetCookie = true;
					}
				 }
		        }
		        
			if (++index === total) {
				var da = fs.readFileSync(goodPath, {encoding: 'utf8'});
				da = da.split('\n');
				da.pop();
				console.log(da);
			}
		    });
		})(ips[i]);
	};
}
if (fs.existsSync(goodPath))
	fs.unlinkSync(goodPath);
check();