<template>
   <div class="time">支付剩余<span ref="overtime">{{countdown}}</span></div>
</template>
<script>
import dialogManager from 'common/plugin/dialog';
import {bus, get} from 'lib/comp/bus';
import browser from "lib/util/browser";
export default {
	props: ["time", "url"],
	data() {
		return {
			countdown: ''
		}
	},
	created() {
		let self = this;
		var timer = null;
		var create = self.timeStamp(self.time.create);
		var expire = self.timeStamp(self.time.expire);
		var now = self.timeStamp(self.time.now);
		
		var initCount = Math.floor(create - (new Date()).getTime());
		var timeShort = Math.floor(now - (new Date()).getTime());
		
		function countStart() {
			var count = Math.floor(expire - (new Date()).getTime() - timeShort) / 1000;
			if (count <= 0) {
				self.countdown = "0分0秒";
				return;
			}
			var min = Math.floor(count / 60);
			var sec = Math.floor(count % 60);
			self.countdown = min + "分" + sec + "秒";
			timer = setTimeout(countStart, 950);
			if (min == 0 && sec == 0) {
				clearTimeout(timer);
				timer = null;
			}
		}
		countStart();
	},
	watch: {
		countdown() {
			let self = this;
			if(self.countdown == "0分0秒") {
				dialogManager.alert("您的订单已过期，请重新购买！", {
                    okText: "我知道了",
                    ok: function() {
						bus.$emit(get("odd"));
						 if(browser.WX){
							// window.history.go(1-window.history.length);
							self.url ? location.assign(self.url) : window.history.go(1-window.history.length);
						}else{
							webBridge.close(4);
						}
                    }
                })
			}
		}
	},
	methods: {
		timeStamp(str) {
			let string = str.replace(/\D/g, "");
            var year = string.substr(0, 4);
            var month = string.substr(4, 2);
            var day = string.substr(6, 2);
            var hour = string.substr(8, 2);
            var minute = string.substr(10, 2);
            var second = string.substr(12, 2) || "00";
            var current = new Date();
            current.setFullYear(year, parseInt(month) - 1, day);
            current.setHours(hour, minute, second);
            return current.getTime();
		}
	}
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-views-order {
    .time {
        text-align: center;
        @include font-size(24px);
        @include lh(46px);
    }
}
</style>

