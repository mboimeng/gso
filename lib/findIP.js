
var fs = require('fs'),
	request = require('./request'),
	path = require('path'),
	cheerio = require('cheerio');

var goodIPs = [];

function find () {
	// return ['58.123.102.99','203.116.165.138','173.194.121.28','61.19.1.118'];
	var da = fs.readFileSync('ips', {encoding: 'utf8'});
	da = da.split('\n');
	console.log(da);
	return da;
}

function check () {
	var ips = find();
	var index = 0, total = ips.length;
	for (var i = 0; i < total; i++) {
		(function (ip) {
		    var headers = {
		        'accept-language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
		        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
		        	'(KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
		        'cookie': 'SID=DQAAAPQAAAD4XWHnXfOAtwfSh8tspJCe5j3k8QTfoPASBDn2jsU'+
			        '5zXPlqOddHA1utBMVPT4WJzGlXq4lulqJUieKtqyewkRqjwUvHCzXKkExXOOxF7Ee2J'+
			        'RKLipV2zVRajPPK2UAE1m0LUuDEpu_Wbl_6eDirWCFGDgRckpGM3TOPFa9xzl2jKz1v'+
			        'Tk6KzGchGgnSJxvBM2MotoxjB9yoxNZbE3s57rY5-TB7pPbsy01RpFhhE1qNNnADi_aPF'+
			        'REz5ia0D_tT6VZJDuKbLjoyaC1hVAox1mT9Htb_q6H4j2MZnIcnt-zOK6oOsJbwiTzBeAFviGnsI'+
			        'C2tn3sHbwPoxHD0uO7y4OP; HSID=ArBQH8hVoHDB6PtJK; SSID=AkZprKO3VkCciaLca; '+
			        'APISID=TI_7FkYUA6woIS0U/AIwLW-d9i9-shl0qO; SAPISID=njIQxwBE24SHMbEg/ALvWEo'+
			        'Ca2tdZzV948; S=analytics-realtime-frontend=9Uwb_B47WWCBBOeI-w7CPg; NID=67=Khu'+
			        'h7Ugr3KJXyoh1NiHqFExdJGyQOQ2aECEs4ZqJkDs75hyZ_Swe-dZIlh_f5cMybgXrnrCr92Wjq6D'+
			        '3Mukdzzg__ZxvwZhnG0guSRb0WUnO8iGd9LY365MBAzj11ZnLoH1tkMng72idQmL3alxnYpXt'+
			        'fk8EKjzR56tWhoSzNpFpSgA4dWIpTnEqgCXfNkwbdEAPa5KRyVkpMbdeFhTYbWqu-pTLUZo5V2F'+
			        '7tBZT; PREF=ID=37bca2920413e3ee:U=901140f55c8e5028:FF=0:LR=lang_en|lang_zh-CN:LD='+
			        'zh-CN:NR=10:NW=1:CR=2:TM=1414509644:LM=1417249318:GM=1:SG=1:S=ogF2K8Rwxlp0p4FL'
		    };

		    var url = 'http://'+ip;
		    var timeout = 1000;
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
		    request(options, function (err, res, body) {
		        if (!err) {
		        	var useTime = new Date().getTime() - startTime;
		        	console.log(url + ": " + useTime + "ms");
				var $ = cheerio.load(body);
				var search = $("#search").find("li.g");
				console.log(url+": " + search.length);
				if (search.length >= 7 && useTime <= timeout) {
					fs.writeFileSync('good_ip', ip+"\n", {encoding: 'utf8', flag: 'a'});
				}
		        }
		        
			if (++index === total) {
				var da = fs.readFileSync('good_ip', {encoding: 'utf8'});
				da = da.split('\n');
				da.pop();
				console.log(da);
			}
			console.log(err);
		    });
		})(ips[i]);
	};
}
if (fs.existsSync('good_ip')) {
	fs.unlinkSync('good_ip');
}
check();