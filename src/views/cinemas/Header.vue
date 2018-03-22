<template>
	<div class="m-header">
		<div class="header">
			<div class="right">
				<div class="tap-city" @click="showSelectCity"><span>{{cityName}}</span><i class="arrow-down" v-show="cityName"></i></div>
			</div>
		</div>
		<select-city
			:show.sync="isShowSelectCity"
			:url="apiLocation"
		    :initialCityCode="queryParams.a"
			:callbackUrl="'/cinema/listshow'"
			:className="className"
		>
		</select-city>
	</div>
</template>

<script>
    import query from 'lib/json/query'
	import {bind} from 'lib/comp/bus'
	import {object} from 'common/utils/defaultProps'
    let queryParams = query.parse(location.search.slice(1));
    export default {
        props: {
			options: object
        },
	    mounted() {	    	
            bind("locatedCity", this.onLocatedCity);
	    },
        data() {        	
            return{
                apiLocation: this.options.href.apiCinemalist,
                queryParams,
	            cityName: "",
	            cityCode: "",
                isShowSelectCity: false,
                className:'selectCity'
            }
        },
	    methods: {
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
	@import '../../common/style/mixin';

	.m-header {
		.arrow-down {
			@include arrow-down();
			vertical-align: middle;
		}

		.header {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 2;
			box-sizing: border-box;
			width: 100%;
			padding: rem(0 24);
			@include display-flex();
			@include justify-content(flex-end);
			@include align-items(center);
			min-height: rem(84);

			>.right {
				/*width: 20%;*/

			}
		}

		.tap-city {
			font-size: rem(30);
			>span {
				padding-right: rem(10);
			}
		}
	}

</style>