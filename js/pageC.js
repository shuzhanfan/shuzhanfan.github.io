// 音乐设置
var audioConfig = {
	enable: true, // 是否开启音乐
	playURL: 'music/happy.wav',
	cycleURL: 'music/circulation.wav'
};

/////////
//背景音乐 //
/////////
function Html5Audio(url, isloop) {
	var audio = new Audio(url);
	audio.autoPlay = true;
	audio.loop = isloop || false;
	audio.play();
	return {
		end: function(callback) {
			audio.addEventListener('ended', function() {
				callback();
			}, false);
		}
	};
};

///////////
//loge动画 //
///////////
var logo = {
	elem: $('.logo'),
	run: function() {
		this.elem.addClass('logolightSpeedIn')
		.on(animationEnd, function() {
			$(this).addClass('logoshake').off();
		});
	}
};


// 获取雪花图片
var snowflakeURL = [
	'images/snowflake/snowflake1.png',
	'images/snowflake/snowflake2.png',
	'images/snowflake/snowflake3.png',
	'images/snowflake/snowflake4.png',
	'images/snowflake/snowflake5.png',
	'images/snowflake/snowflake6.png'
]

///////
//飘雪花 //
///////
 function snowflake() {
 	
	// 雪花容器
	var $flakeContainer = $("#snowflake");

	// 随机六张图
	function getImagesName() {
		return snowflakeURL[[Math.floor(Math.random() * 6)]];
	}

	// 创建一个雪花元素
	function createSnowBox() {
		var url = getImagesName();
		return $('<div class="snowbox"/>').css({
			'width': 41,
	        'height': 41,
	        'position': 'absolute',
	        'backgroundSize': 'cover',
	        'zIndex': 100000,
	        'top': '-41px',
	        'backgroundImage': 'url(' + url + ')'
	        }).addClass('snowRoll');
	}

	// 开始飘雪
	setInterval(function() {
		// 运动轨迹
		var startPositionLeft = Math.random() * visualWidth - 100,
			startOpacity      = 1,
			endPositionTop    = visualHeight - 40,
			endPositionLeft   = startPositionLeft - 100 + Math.random() * 500,
			duration          = visualHeight * 10 +Math.random() * 5000;
			
		// 随机透明度，不小于0.5
		var randomStart = Math.random();
		randomStart = randomStart < 0.5 ? startOpacity : randomStart;

		// 创建一个雪花
		var $flake = createSnowBox();

		// 设计起点位置
		$flake.css({
			left: startPositionLeft,
			opacity: randomStart
		});

		// 加入容器
		$flakeContainer.append($flake)

		// 开始执行动画
		$flake.transition({
			top: endPositionTop,
			left: endPositionLeft,
			opacity: 0.7
		}, duration, 'ease-out', function() {
			$(this).remove() //结束后删除
		});
	}, 200);
}