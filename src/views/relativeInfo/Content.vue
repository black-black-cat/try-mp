<template>
	<div class="container" v-if="list.length">
		<ul>
			<li v-for="(item, key) in list" :key="key">
				<media-object :data="item" :url="item._url" :time="item.show_time"></media-object>
			</li>
		</ul>
		<div class="load-more" v-if="isMore" @click="loadMore">
			更多 <i class="arrow-down"></i>
		</div>
		<touched-bottom v-else></touched-bottom>
	</div>
</template>

<script>
    import MediaObject from "common/components/mediaObjectNews";
    import TouchedBottom from "common/components/touchedBottom";
    import {array} from "common/utils/defaultProps";
	export default {
	    props: {
			list: array,
		    isMore: {
			    type: Boolean,
			    default: false
		    }
	    },

		components: {
	        MediaObject,
            TouchedBottom
		},

		methods: {
			loadMore() {
				const vm = this;
				vm.$emit("loadMore")
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
	.load-more {
		padding: rem(50px 0);
		text-align: center;
	}
	.arrow-down {
		vertical-align: middle;
		@include arrow-down();
	}
</style>