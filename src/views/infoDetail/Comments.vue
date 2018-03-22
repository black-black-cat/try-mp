<template>
	<div class="comments">
		<div class="header">
			<div class="title">热门评论</div>
		</div>
		<comment-item ></comment-item>
	</div>
</template>

<script>
	import CommentItem from "common/components/comment";
    export default {
        props: {
            options: Object
        },
        data() {
            return {}
        },
	    components: {
            CommentItem
	    }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";
	.comments {

	}
	.header {
		@include display-flex();
		@include justify-content(space-between);
		min-height: r(80);
		margin-left: r(24);
		padding-right: r(24);
		border-bottom: r(1) solid transparent;

		.title,
		.more {
			line-height: r(80);
			font-size: r(30);
			.arrow-right {
				@include arrow-right;
			}
		}

		.more {
			// @include flex(0);
			width: r(120);
			text-align: right;
		}
	}
</style>
