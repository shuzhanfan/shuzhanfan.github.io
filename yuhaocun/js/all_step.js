$(function() {	   
	// 页面滚动到指定的位置
	function scroll(time, proportionX) {
	    var distX = container.width() * proportionX;
	    swipe.scrollTo(distX, time);
	};

   // 修正小女孩的位置
	girl.setOffset();

    // 男孩走路 修正男孩位置
    var boy = BoyWalk();
    
    // 开始音乐
    function playMusic() {
    	var audio1 = Html5Audio(audioConfig.playURL);
    	audio1.end(function() {
    	Html5Audio(audioConfig.cycleURL, true);
    	});
    };

    playMusic();
    
    // 开始
    function init() {
    	boy.walkTo(1000, 0.2)
    		.then(function() {
    			// 第一次走路完成
    			scroll(5000, 1);
    		}).then(function() {
    			// 第二次走路
    			return boy.walkTo(5000, 0.5);
    		}).then(function() {
    			// 暂停走路
    			boy.stopWalk();
    		}).then(function() {
    			// 开门
    			return openDoor();
    		}).then(function() {
    			// 开灯
    			lamp.bright();
    		}).then(function() {
    			// 进商店
    			return boy.toShop(2000);
    		}).then(function() {
    			// 取花
    			return boy.talkFlower();
    		}).then(function() {
    			// 飞鸟
    			bird.fly();
    		}).then(function() {
    			// 出商店
    			return boy.outShop(2000);
    		}).then(function() {
    			// 关门
    			return shutDoor();
    		}).then(function() {
    			// 灯暗
    			lamp.dark();
    		}).then(function() {
    			// 到页面三
    			scroll(3000, 2)
    		}).then(function() {
    			// 男孩到第三个页面起点
    			return boy.walkTo(3000, 0)
    		}).then(function() {
    			// 到桥底
    			return boy.walkTo(2000, 0.15)
    		}).then(function() {
    			// 走路到桥上left,top
    			return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight())
    				/ visualHeight)
    		}).then(function() {
    			// 实际走路的比例
    			var proportionX = (girl.getOffset().left - boy.getWidth()
    				- girl.getWidth() / 6) / visualWidth
    			// 桥上走到女孩旁
    			return boy.walkTo(1500, proportionX);
    		}).then(function() {
    			// 图片还原，原地停止状态
    			boy.resetOriginal();
    		}).then(function() {
    			// 增加转身动作
    			setTimeout(function() {
    				girl.rotate();
    				boy.rotate();
    					//开始动画
    					logo.run();
    					snowflake();
    			}, 1000);
    		})
    }
    init();
});  