<template>
	<div class="container">
		<div class="section" v-for="(item, i) in list" :key="i">
			<p class="question">{{item.q}}</p>
			<p class="answer" v-if=" typeof item.a === 'string' ">{{item.a}}</p>
			<div class="answer" v-else>
				<div class="row" v-for="(text, i) in item.a" :key="i">
					<div class="num">{{i+1}})</div>
					<div class="text">{{text}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    data() {
        return {
//            1）优惠券每个订单仅可使用1张优惠券
//        2）优惠券不可兑换、找零、开具发票、转让
//        3）优惠券不能用于或抵扣第三方平台的费用
//        4）优惠券使用应当遵守期限制的条件
//        5）优惠券券只通过官方平台发放、官方活动获取、相关第三
//        方联合活动获取，或自动配给
            list: [
	            {
	                q: "如何获取优惠券",
		            a: "影院会在各种活动、商务合作中向用户发放优惠券，获取到优惠券的用户可以在“我的”下的优惠券列表中查看或人为添加。"
	            },
	            {
	                q: "如何使用优惠券",
		            a: "在影院手机APP或微信服务号中：进入影院排期表--选择适合的优惠券--支付剩余差价，即可使用相关优惠券。"
	            },
	            {
	                q: "使用优惠券需要注意点",
		            a: [
		                "每个订单仅可使用1张优惠券",
			            "优惠券不可兑换、找零、开具发票、转让",
			            "优惠券不能用于或抵扣第三方平台的费用",
			            "优惠券使用应当遵守限制的条件",
			            "优惠券只通过官方平台发放、官方活动获取、相关第三方联合活动获取，或自动配给"
		            ]
	            }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.container {
		padding: rem(0 24);

		.section {
			padding: rem(24 0);

			.question {
				padding: rem(24 0);
				font-size: rem(32);
			}

			.answer {
				line-height: 1.5;
				font-size: rem(26);
			}
		}
	}

	.row {
		@include display-flex;
    	@include align-items(flex-start);

		.num {
			padding-right: rem(20);
		}
	}
</style>

<style lang="scss">
	html, body {
		height: 100%;
		overflow: auto;
	}
</style>