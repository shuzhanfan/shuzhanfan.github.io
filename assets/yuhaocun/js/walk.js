// 全局参数
var container = $("#content");
var swipe = Swipe(container);
var visualWidth = container.width();
var visualHeight = container.height();
var instanceX;  // 男孩和商店的距离差

// 动画结束事件，小男孩转身动作用到该函数
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('webKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();

// 获取数据
var getValue = function(className) {
	var $elem = $('' + className + '')
	// 走路的路线坐标
	return {
		height: $elem.height(),
		top: $elem.position().top
	};
};

// 桥的Y轴
var bridgeY = function() {
	var data = getValue('.c_background_middle')
	return data.top;
}();

////////////////////////////////////////////////////////
// ================= 动画处理 ======================= //
////////////////////////////////////////////////////////

////////
//小女孩 //
////////
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
	// 转身动作
	rotate: function() {
		this.elem.addClass('girl-rotate');
	},
	setOffset: function() {
		this.elem.css({
			left: visualWidth / 2,
			top: bridgeY - this.getHeight()
		});
	},
	getOffset: function() {
		return this.elem.offset()
	},
	getWidth: function() {
		return this.elem.width()
	}
};

/**
 * 小孩走路
 * @param {[type]} container [description]
 */

function BoyWalk() {

	var container = $("#content");
	// 页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();

	var swipe = Swipe($("#content"));
	// 获取数据
	var getValue = function(className) {
		var $elem = $('' + className + '');
		// 走路的路线坐标
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	};

	// 路的Y轴
	var pathY = function() {
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();

	var $boy = $("#boy");
	var boyWidth = $boy.width();
	var boyHeight = $boy.height();
	// 修正小男孩的正确位置
	// 路的中间位置减去小男孩的高度，25是一个修正值
	$boy.css({
		top: pathY - boyHeight + 25
	});


	////////////////////////////////////////////////////////
	//===================动画处理============================ //
	////////////////////////////////////////////////////////

	// 暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk')
	}

	// 恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}

	// css3的动画变化
	function slowWalk() {
		$boy.addClass('slowWalk');
	}

	// 计算移动距离
	function calculateDist(direction, proportion) {
		return(direction == "x" ?
			visualWidth : visualHeight) * proportion;
	}

	// 用transition做运动
	function stratRun(options, runTime) {
		var dfdPlay = $.Deferred();
		// 恢复走路
		restoreWalk();
		// 运动属性
		$boy.transition(
			options, runTime, 'linear', function() {
				dfdPlay.resolve(); // 动画完成
			});
		return dfdPlay
	}

	// 开始走路
	function walkRun(time,dist,disY) {
		time = time || 3000;
		// 脚动作
		slowWalk();
		//开始走路
		var d1 = stratRun({
			'left': dist + 'px',
			'top': disY? disY : undefined
		}, time)
		return d1;
	}

	// 走进商店
	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door');
		// 门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left ;
		// 小孩当前的坐标
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;

		// 当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorObj.width() / 2) - 
		(boyOffsetLeft + $boy.width() / 2);

		// 开始走路
		var walkPlay = stratRun({
			transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
			opacity: 0.1
		}, runTime);
		// 走路完毕
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			});
			defer.resolve();
		});
		return defer;
	}

	// 走出商店
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk()
		// 开始走路
		var walkPlay = stratRun({
			transform: 'translateX(' + instanceX + 'px),scale(1,1)',
			opacity: 1
		}, runTime);
		// 走路完毕
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}

	// 取花
	function talkFlower() {
		// 增加延时等待效果
		var defer = $.Deferred();
		setTimeout(function() {
			// 取花
			$boy.addClass('slowFlowerWalk');
			defer.resolve();
		}, 1000);
		return defer;
	}

	return {
		// 开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX)
			var distY = calculateDist('y', proportionY)
			return walkRun(time, distX, distY);
		},
		// 停止走路
		stopWalk: function() {
			pauseWalk();
		},
		// 走进商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		// 走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},
		setColor: function(value){
			$boy.css('background-color', value)
		},
		// 取花
		talkFlower: function() {
			$boy.addClass('slowFlowerWalk');
		},
		// 获得男孩宽度
		getWidth: function() {
			return $boy.width();
		},
		// 复位初始状态
		resetOriginal: function() {
			this.stopWalk();
			// 恢复图片
			$boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
		},
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			// 监听转身完毕
			if (callback) {
				$boy.on(animationEnd, function() {
					callback();
					$(this).off();
				})
			}
		}
	}
}
