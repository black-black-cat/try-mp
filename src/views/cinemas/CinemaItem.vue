<template>
	<div class="m-cinema-item container">

		<div class="section-1" v-href="options.href.urlShow" :data-query="'ci=' + data.cinema_code">
			<div class="row row-1 vh-between">
				<div class="left">{{data.cinema_name}}</div>
				<div class="right" v-if="data.cardMinPrice">
					<span class="start">会员 &yen;</span>
					<span class="num">{{data.cardMinPrice}}</span>
					<span class="last">起</span>
				</div>
				<div class="right" v-else><span>{{data.min_price}}</span><span class="last">起</span></div>
			</div>
			<div class="row row-2 vh-between">
				<div class="left">{{data.cinema_address}}</div>
				<div class="right" v-if="data._distance">{{data._distance}}</div>
			</div>
			<div class="row row-3 vh-between">
				<div class="left">
					<div class="feature-label" v-for="(item, i) in data.feature_hall" :key="i">{{item.explain}}</div>
				</div>
				<div class="right"></div>
			</div>
		</div>

		<!-- <div class="section-2">
			<swiper :options="swiperOption" ref="swiper">
				<swiper-slide>

				</swiper-slide>
			</swiper>
		</div> -->

	</div>
</template>

<script>
    import {array, object} from 'common/utils/defaultProps'
    // import { swiper, swiperSlide } from 'common/plugin/swiper'

    export default {
        props: {
			data: object,
			options: object,
			targetUrl: {
				type: String,
				default: ""
			}
        },
        data() {
            return {
                features: null,
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 3000
                }
            }
		},

	    methods: {

	    }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.m-cinema-item {
		padding: rem(0 24 30 0);
	}

	.section-1 {
		.row {
			padding-top: 1em;

			&-1 {
				font-size: rem(34);
			}

			&-2 {
				font-size: rem(28);
			}

			>.left {
				@include ellipsis();
			}
			>.right {
                @include flex-shrink(0);
			}
		}

		.row-1 {
			.right {
				>.start {
					display: inline-block;
					@include translate(rem(10), 0);
				}
				>.num {
					font-size: rem(34);
				}
				>span {
					font-size: rem(24);
				}
			}
		}

		.feature-label {
			display: inline-block;
			padding: rem(4 10);
			@include radius(rem(20px));
			font-size: rem(12);
		}
	}
</style>