<template>
	<section class="m-content">
		<div class="discount vh-center" v-if="content.ad.length > 0" :style="{height: height}">
			<lazy-image :src="content.ad[0].img" @suc="load"/>
			<ad-compass :ad='content.ad[0]' v-if='content.ad[0].contentID'/>
		</div>
		<template v-if="content.cinemaMode == 1 || content.cinemaMode == 2">
			<template v-if="content.cards && content.cards.length || content.cardConfig.isSupportBind">
				<div class="card-title vh-between">
					<div class="member vh-left"><span>会员卡</span><span class="sub"
					                                                  v-if="content.cards.length > 0">(已有{{content.cards.length}}张,已绑定)</span><span
						class="sub" v-else>(已有0张,未绑定)</span></div>
					<template v-if="content.cardConfig.isSupportRegister">
						<div class="open" v-if="content.bindMobile == 1" v-href="content.href.urlMemberpolicy">
							<span>去开卡</span>
							<i class="arrow-right"></i>
						</div>

						<div class="open" v-else @click="showMobile">
							<span>去开卡</span>
							<i class="arrow-right"></i>
						</div>
					</template>
				</div>
				<swiper-card :content="content"/>
			</template>
		</template>
		<template v-else>
			<div class="card-title vh-between">
				<div class="member vh-left">
					<span>会员卡</span>
					<span class="sub" v-if="content.cards.length > 0">(已有{{content.cards.length}}张,已绑定)</span>
					<span class="sub" v-else>(已有0张,未绑定)</span>
				</div>
				<template v-if="content.bindMobile == 1">
					<div class="open" v-if="content.cinemaMode == 2"  v-href="content.href.urlMemberpolicy">
						<span>去开卡</span>
						<i class="arrow-right"></i>
					</div>
					<!-- v-href="openPage(content.href.urlMemberpolicy, storedCinema) :data-query="'ci=' + storedCinema" -->
					<div class="open" v-if="content.cinemaMode == 3"  @click="openPage(content.href.urlMemberpolicy, storedCinema)" >
						<span>去开卡</span>
						<i class="arrow-right"></i>
					</div>
				</template>

				<div class="open" v-else @click="showMobile">
					<span>去开卡</span>
					<i class="arrow-right"></i>
				</div>
			</div>
			<swiper-card :content="content"/>
		</template>
		<ul class="me-items">
			<li class="item" v-href="content.href.urlCoupons">
				<i class="icon-coupon"></i>
				<span class="name">优惠券</span>
			</li>
			<li class="item" @click="msg">
				<i class="icon-comment"></i>
				<span class="name">我的评论</span>
			</li>
			<li class="item" @click="msg">
				<i class="icon-feedback"></i>
				<span class="name">意见反馈</span>
			</li>
			<li class="item" @click="msg">
				<i class="icon-call-out"></i>
				<span class="name">呼叫中心</span>
			</li>
		</ul>
	</section>
</template>
<script>
    import swiperCard from './Card.vue'
    import {array, object} from 'common/utils/defaultProps'
    import dialogManager from 'common/plugin/dialog'
    import {fire, get} from 'lib/comp/bus'
    import viewport from 'lib/comp/viewport'
	import urlUtil from 'lib/util/URL'
	import openUrl from 'common/utils/openUrl'
	import adCompass from 'common/components/adCompass'

    export default {
        props: {
            content: object
        },
        data () {
            return {
                height: 0,
				storedCinema: ""
            }
        },
		created() {
			this.storedCinema = localStorage.getItem("memberCard.cinema") || "";
			if (this.storedCinema == 'undefined') {
				this.storedCinema = ""
			}
		},
        components: {
        	swiperCard,
        	adCompass
        },
        methods: {
            msg () {//功能建设中，敬请期待
                dialogManager.toast("功能建设中，敬请期待");
            },
            showMobile () {
                fire("mobile");
            },
            load () {
                this.height = viewport.rem() / 75 * 216 + "px";
            },
			openPage(url, cinema) {
				let obj = urlUtil.parse(url);

				if (cinema) {
					!obj.queryJson.ci && ( obj.queryJson.ci = cinema );
				} else {
					!obj.queryJson.ci && delete obj.queryJson.ci;
				}

				url = urlUtil.build(obj)
				openUrl(obj.path, obj.queryJson)
				// return urlUtil.build(obj);
			}
        }
    }
</script>
<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.m-content {
		padding-top: rem(434px);
		padding-bottom: rem(121px);
	}

	.discount {
		height: 0;
		@include transition(height 0.3s ease);
		img {
			@include max-width(676px);
			@include min-height(126px);
		}
	}

	.card-title {
		@include height(88px);
		padding: rem(0 24px);
		.member {
			@include font-size(30px);
		}
		.sub {
			@include font-size(24px);
			padding-top: rem(6px);
			padding-left: rem(8px);
		}
		.open {
			@include font-size(24px);
		}
		.arrow-right {
			margin-left: rem(10px);
			@include arrow-right;
			margin-right: rem(-10px);
		}
	}

	.me-items {
		@include display-flex;
		@include justify-content(space-around);
		@include align-items(center);
		@include wh(100%, 190px);
		margin-top: rem(24px);
		.item {
			text-align: center;
			@include wh(100%, 190px);
			@include display-flex;
			@include flex-wrap(wrap);
			@include align-content(flex-end);
			@include justify-content(center);
			.name {
				padding-top: rem(24px);
				display: block;
				width: 100%;
				@include font-size(26px);
				padding-bottom: rem(47px);
			}
		}
	}
</style>