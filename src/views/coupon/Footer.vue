<template>
	<div class="footer container">
		<div class="content" @click="showAll">查看全部券 <span class="arrow-right"></span></div>
	</div>
</template>

<script>
export default {
    data() {
        return {}
    },
	methods: {
        showDisable() {
            this.$emit("showDisable")
        },
        showAll() {
            this.$emit("showAll")
        }
	}
}
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";
	.arrow-right {
		@include arrow-right();
		display: inline-block;
		vertical-align: middle;
	}
	.container {
		@include display-flex;
        @include justify-content(center);
        @include align-items(center);
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: rem(88px);
		font-size: rem(26);

		.content {
			line-height: rem(88px);
		}
	}
</style>