<template>
<div class="valid-form container">
	<div class="title">请输入验证码</div>
	<div class="body">
		<div class="row-1">
			<div class="input-wrapper" @click="focusInput" v-if="isNeedValideCode">
				<input type="text" v-model="validCode" placeholder="券校验码">
			</div>
		</div>

		<div class="row-2">
			<div class="input-wrapper" @click="focusInput">
				<input type="text" v-model="captcha" placeholder="图形验证码">
			</div>
			<div class="valid-img" @click="makeUrlCaptcha">
				<img :src="compUrlCaptcha"/>
			</div>
		</div>
	</div>
</div>
</template>

<script>
    export default {
        props: {
            option: Object
        },
        data() {
            return {
                validCode: "",
	            captcha: "",
                urlCaptcha: this.option.urlCaptcha,
	            isNeedValideCode: this.option.validCode,
                compUrlCaptcha: this.option.urlCaptcha
            }
        },
	    computed: {

	    },
        components: {
        },
	    mounted() {
            this.makeUrlCaptcha();
	    },
	    methods: {
            focusInput(ev) {
                let el = ev.currentTarget;
                el && el.querySelector("input").focus();
            },
            makeUrlCaptcha() {
                let time = new Date() - 0;
                let url = this.urlCaptcha;
                let divide = url.includes("?") ? "&" : "?";
                this.compUrlCaptcha = url + divide + "_time=" + time;
            }
	    }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
	.container {
		padding: rem(24 24 0);

		.title {
			padding: rem(24 0);
			text-align: center;
			font-size: rem(32);
		}

		.row-1,.row-2 {
			margin: rem(24 auto)
		}

		.row-2 {
			@include display-flex();
			@include justify-content(space-between);
			@include align-items(center);

			.valid-img {
				@include wh(158, 66);
				margin-left: rem(24);
				>img {
					@include wh(100%, 100%);
				}
			}
		}

		.input-wrapper {
			@include display-flex();
			@include justify-content(center);
			@include align-items(center);
			height: rem(80);
			padding-left: rem(24);
			>input {
				border: none;
				line-height: rem(28);
				width: 100%;
				font-size: rem(28);
			}
		}
	}
</style>
