<template>
	<div class="m-comment">
		<div class="left">
			<lazy-image :src="data.user_faceurl" initSrc="/images/common/152x152.jpg"></lazy-image>
		</div>
		<div class="right">
			<div class="row-1">
				<div class="row-1-1">{{data.user_name}}</div>
				<div class="row-1-2">
					<star-display use="display" :rating="data.score"></star-display>
				</div>
			</div>
			<div class="row-2">
				{{data.content}}
			</div>
			<div class="row-last">
				<div class="row-last-left">{{data.show_time}}</div>
				<div class="row-last-right" v-if="false">
					<i class="icon-thumb"></i>
					<span>{{data.likes ? data.likes : "34"}}</span>
					<i class="icon-msg"></i>
					<span>{{data.comments ? data.comments : "70"}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {object} from "common/utils/defaultProps";
    export default {
        props: {
            data: object
        }
    }
</script>

<style lang="scss" scoped>
	@import "../style/mixin";

	.m-comment {
		@include display-flex();
		@include justify-content(flex-start);
		@include align-items(flex-start);
		margin-left: r(24);
		padding: r(34) 0;
		padding-right: r(24);

		.left {
            @include flex-shrink(0);
			@include wh(80, 80);
			@include radius(rem(80px));
			margin-right: r(24);

			> img {
				@include wh(100%, 100%);
				@include radius(60%);
			}
		}

		.right {
			@include flex(1);
			@include display-flex();
			@include flex-direction(column);
			@include justify-content(space-between);
			.row-1 {
				width: 100%;
				min-height: r(80);
				@include ellipsis();

				.row-1-1 {
					padding-bottom: r(16);
					line-height: 1.5;
				}
				.row-1-2 {
					@include transform(scale(0.6));
					@include transform-origin(0 0);
					margin-bottom: r(-20);
				}
			}
			.row-2 {
				padding-top: r(35);
				padding-bottom: r(35);
				font-size: r(28);
				line-height: r(38);
				width: r(600);
				overflow-x: auto;
				// 高度随评论内容，不隐藏
				// @include line-clamp(3);
			}
			.row-last {
				@include display-flex();
				@include justify-content(space-between);
				@include align-items(center);

				.row-last-left {
					font-size: r(24);
				}

				.row-last-right {
					@include display-flex();
					@include justify-content(flex-end);
					@include align-items(center);
					> * {
						display: inline-block;
					}
					> span {
						font-size: r(24);
						margin-left: r(10);
						width: r(50);
					}
				}
			}
		}
	}
</style>

