<template>
   <div class="status" :data-cancel-api="data.apiCancel">支付剩余<span>{{countdown}}</span></div>
</template>
<script>
export default {
	props: ["time", "data"],
	data() {
		return {
			countdown: ''
		}
	},
	created() {
		let self = this;
		let string1 = self.time.create.replace(/\D/g, "");
		let string2 = self.time.expire.replace(/\D/g, "");
		let string3 = self.time.now.replace(/\D/g, "");
		var timer = null;

		var year1 = string1.substr(0, 4);
		var month1 = string1.substr(4, 2);
		var day1 = string1.substr(6, 2);
		var hour1 = string1.substr(8, 2);
		var minute1 = string1.substr(10, 2);
		var second1 = string1.substr(12, 2) || "00";

		var current = new Date();
		current.setFullYear(year1, parseInt(month1) - 1, day1);
		current.setHours(hour1, minute1, second1);

		var year2 = string2.substr(0, 4);
		var month2 = string2.substr(4, 2);
		var day2 = string2.substr(6, 2);
		var hour2 = string2.substr(8, 2);
		var minute2 = string2.substr(10, 2);
		var second2 = string2.substr(12, 2) || "00";

		var current1 = new Date();
		current1.setFullYear(year2, parseInt(month2) - 1, day2);
		current1.setHours(hour2, minute2, second2);

		var year3 = string3.substr(0, 4);
		var month3 = string3.substr(4, 2);
		var day3 = string3.substr(6, 2);
		var hour3 = string3.substr(8, 2);
		var minute3 = string3.substr(10, 2);
		var second3 = string3.substr(12, 2) || "00";

		var current2 = new Date();
		current2.setFullYear(year3, parseInt(month3) - 1, day3);
		current2.setHours(hour3, minute3, second3);
		
		var initCount = Math.floor(current.getTime() - (new Date()).getTime());
		var timeShort = Math.floor(current2.getTime() - (new Date()).getTime());
		
		function countStart() {
			var count = Math.floor(current1.getTime() - (new Date()).getTime() - timeShort) / 1000;
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
	methods: {
		cancel() {
			const vm = this;
			vm.$http.get(vm.data.apiCancel).then(function () {
				vm.$emit("countdownEnd");
			}).catch(function (err) {
				console.log(err.msg)
			})
		}
	}
}
</script>