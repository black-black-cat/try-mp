<template>
	<div class="m-top-nav" :class="{colorful: mode != 1}">
		<div class="item left">
			<div class="tap-city" v-if="mode == 3" @click="showSelectCity"><span>{{cityName}}</span><i class="arrow-down" v-show="cityName"></i></div>
		</div>
		<div class="item views-nav" v-if="false">
			<div class="item item-left" :class="{active: nav[0].active, colorful: mode != 1}" data-title="movie" @click="showView('movie')">影片</div>
			<div class="item item-right" :class="{active: nav[1].active, colorful: mode != 1}" data-title="cinema" @click="showView('cinema')">影院</div>
		</div>
		<div class="item right">
			<div class="tap-location vh-center" v-if="mode == 1 || mode == 2" @click="showSelectCity"><i class="icon-location-2"></i></div>
		</div>

		<select-city
			:show.sync="isShowSelectCity"
			:url="apiLocation"
		></select-city>
	</div>
</template>

<script>
    import {array, object} from 'common/utils/defaultProps'
	import {bind} from 'lib/comp/bus'
	import query from 'lib/json/query'

	let queryParams = query.parse(location.search.slice(1));

    export default {
        props: {
            data: object,
	        mode: {
                type: Number,
		        default: 1, // 1 透明背景，右边定位按钮 | 2 白色背景，右边定位按钮 | 3 白色背景，左边城市定位，右边筛选
	        },
	        nav: array,
        },
        data() {
            return {
                isShowSelectCity: false,
	            apiLocation: `/dyh5/web/city/list?b=${queryParams.b}`,
	            cityName: "",
	            cityCode: "",
	            areaData: null,
            }
        },
	    mounted() {
//            this.isShowSelectCity = true;
		    bind("locatedCity", this.onLocatedCity);
	    },
	    methods: {
            showView(title) {
                this.$emit("showView", title)
            },
		    showSelectCity() {
                this.isShowSelectCity = true;
		    },

		    onLocatedCity(data) {
                const vm = this;
                Object.assign(vm, data);
		    }
	    }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";
	.arrow-down {
		@include arrow-down();
		vertical-align: middle;
	}
	.m-top-nav {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 2;
		box-sizing: border-box;
		width: 100%;
		padding: rem(0 24);
		@include display-flex();
		@include justify-content(space-between);
		@include align-items(center);
		min-height: rem(84);

		>.item {
			width: 33.33%;
		}
	}
	.tap-city {
		font-size: rem(30);
		>span {
			padding-right: rem(10);
		}
	}
	.tap-cinema, .tap-location{
		position: absolute;
		z-index: 13;
		top: rem(14px);
		right: rem(20px);
		@include wh(62px);
		@include radius(rem(62px));
	}
	.views-nav {
		@include display-flex();
		.item {
			@include wh(120, 64);
			line-height: rem(64);
			text-align: center;
			font-size: rem(30);
		}

		.item-left {
			@include radius(rem(62px) 0 0 rem(62px));
			@include translate(rem(1), 0)
		}
		.item-right {
			@include radius(0 rem(62px) rem(62px) 0);
			@include translate(rem(-1), 0)
		}

	}
</style>