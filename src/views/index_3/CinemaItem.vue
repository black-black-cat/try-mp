<template>
	<div class="m-cinema-item container">

		<div class="section-1">
			<div class="row row-1 vh-between">
				<div class="left">{{data.name}}</div>
				<div class="right"></div>
			</div>
			<div class="row row-2 vh-between">
				<div class="left">{{data.address}}</div>
				<div class="right"></div>
			</div>
			<div class="row row-3 vh-between">
				<div class="left"></div>
				<div class="right">排片</div>
			</div>
		</div>

		<div class="section-2">
			<swiper :options="swiperOption" ref="swiper">
				<swiper-slide>

				</swiper-slide>
			</swiper>
		</div>

	</div>
</template>

<script>
    import {array, object} from 'common/utils/defaultProps'
    import { swiper, swiperSlide } from 'common/plugin/swiper'

    export default {
        props: {
			data: object
        },
        data() {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 3000
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.m-cinema-item {
		padding: rem(0 24);
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
		}
	}
</style>