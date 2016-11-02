/*===============================================================================
************   Shake   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	$.shake = function() {
		if (window.DeviceMotionEvent) {
			//获取移动速度，得到device移动时相对之前某个时间的差值比
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		} else {
			alert('您好，你目前所用的设备好像不支持重力感应哦！');
		}

		//设置临界值,这个值可根据自己的需求进行设定，默认就3000也差不多了
		var shakeThreshold = 400;
		//设置最后更新时间，用于对比
		var lastUpdate = 0;
		//设置位置速率
		var curShakeX,curShakeY,curShakeZ,lastShakeX,lastShakeY,lastShakeZ = 0;

		function deviceMotionHandler(event) {
			//获得重力加速
			var acceleration = event.accelerationIncludingGravity;

			//获得当前时间戳
			var curTime = new Date().getTime();

			if ((curTime - lastUpdate) > 100) {

				//时间差
				var diffTime = curTime - lastUpdate;
				lastUpdate = curTime;


				//x轴加速度
				curShakeX = acceleration.x;
				//y轴加速度
				curShakeY = acceleration.y;
				//z轴加速度
				curShakeZ = acceleration.z;

				var speed = Math.abs(curShakeX + curShakeY + curShakeZ - lastShakeX - lastShakeY - lastShakeZ) / diffTime * 10000;

				if (speed > shakeThreshold) {
					alert("正在摇")
					//TODO 相关方法，比如：

					//播放音效
					//shakeAudio.play();
					//播放动画
					// $('.shake_box').addClass('shake_box_focus');
					// clearTimeout(shakeTimeout);
					// var shakeTimeout = setTimeout(function() {
					// 	$('.shake_box').removeClass('shake_box_focus');
					// }, 1000)

				}

				lastShakeX = curShakeX;
				lastShakeY = curShakeY;
				lastShakeZ = curShakeZ;
			}
		}

		//预加摇一摇声音
		// var shakeAudio = new Audio();
		// shakeAudio.src = 'sound/shake_sound.mp3';
		// var shake_options = {
		// 	preload: 'auto'
		// }
		// for (var key in shake_options) {
		// 	if (shake_options.hasOwnProperty(key) && (key in shakeAudio)) {
		// 		shakeAudio[key] = shake_options[key];
		// 	}
		// }

	};
}(Zepto);