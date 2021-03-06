var words = [
	'一念靜心 花開遍世界<br>每临绝境 峰回路又转',
	'随你走在天际，看繁华满地。',
	'愿此时的暖阳 也在静静照耀你<br>带着我所有的感激 对你们的思念',
	'心中升起的喜悦 总在归乡的旅程<br>当家门在开启时 我会紧紧拥抱你',
	'褪尽风华，我依然在彼岸守护你。',
	'那被岁月覆盖的花开，一切白驹过隙成为空白。',
	'生活总是让我们遍体鳞伤，但到后来，那些受伤的地方一定会变成我们最强壮的地方。',
	'如果全世界都对你恶语相加，我就对你说上一世情话。',
	'我一直以为最糟糕的情况是你离开我，其实最令我难过的，是你不快乐。'
];

function getRandom (arr) {
	var randomNum = Math.floor(Math.random()*arr.length) || 0;
	return arr[randomNum];
}
var random = {
	getWord: function () {
		return getRandom(words);
	}
};

module.exports = random;
