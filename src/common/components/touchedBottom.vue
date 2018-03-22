<template>
	<div class="m-touched-bottom">
		<span class="line"></span> {{msg}} <span class="line"></span>
	</div>
</template>

<script>
    export default {
        props: {
			msg: {
			    type: String,
				default: "哦哟~到底了"
			}
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
	@import "../style/mixin";
	.m-touched-bottom {
		@include display-flex();
		@include justify-content(center);
		@include align-items(center);
		padding-top: r(24);
		padding-bottom: r(34);
		font-size: r(26);
		text-align: center;

		.line {
			display: inline-block;
			width: r(40);
			height: 1px;
			margin: rem(auto 24px);
		}
	}
</style>
