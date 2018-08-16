function Swipe(container){
	//获得第一个子节点
	var element = container.find("ul:first");

	//滑动对象
	var swipe = {};

	//li页面数量
	var slides = element.find(">");

	//获得容器尺寸
	var width = container.width();
	var height = container.height();

	// 设置li页面的总宽度
	element.css({
		width: (slides.length * width) + 'px',
		height: height + 'px'
	});

	// 设置每一个页面li的宽度
	$.each(slides, function(index) {
		var slide = slides.eq(index); // 获得每一个li元素
		slide.css({
			width: width +'px',
			height: height + 'px'
		})
	});

	//监控完成与移动
	swipe.scrollTo = function(x, spend) {
		//执行动画移动
		element.css({
			'transition-timing-function': 'linear',
			'transition-duration'		: spend + 'ms',
			'transform'					: 'translate3d(-' + x + 'px,0px,0px)'//设置页面x轴移动
		});
		return this;
	};
	return swipe;
}
