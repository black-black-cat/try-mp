<template>
	<div class="m-cinemas">
		<ul class="list" v-if="areaData">
			<li v-for="item in areaData">
				<cinema-item :data="item"></cinema-item>
			</li>
		</ul>
	</div>
</template>

<script>
    import {array, object} from 'common/utils/defaultProps'
    import CinemaItem from './CinemaItem'
    import {bind} from 'lib/comp/bus'
	export default {
	    props: {
			options: object,
	    },
		data() {
	        return {
	            areaData: null,
	        }
		},
		components: {
            CinemaItem
		},
		mounted() {
	        bind("locatedCity", this.onLocatedCity);
		},
		methods: {
	        getList() {

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

	.m-cinemas {
		padding: rem(84 0 98);
	}
</style>