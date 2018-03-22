<template>
	<div class="m-popup-ad container" @click="hide">
		<div class="content" :class="[size]" @click="onContentClicked">
            <lazy-image :src="adData.img"></lazy-image>
            <ad-compass :ad='adData' v-if='adData.contentID'/>
		</div>
		<div v-if="size != 'fullscreen' || closeBtnShow" class="footer" :class="[size]" @click="hide">
			<i :class="{'close-full': size == 'fullscreen', 'close': size != 'fullscreen'}"></i>
		</div>
		<bind-mobile :show.sync="isBindMobileShow" :subUrl="apiBind" :url="apiCode"
		             @onBindSuccess="bindMobileSuccess"
		></bind-mobile>
	</div>
</template>

<script>
	// 需要先注册bind-mobile插件

    import {object} from "common/utils/defaultProps";
    import dialogManager from "common/plugin/dialog";
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    import storageMessager from "lib/util/storageMessager"
    import adCompass from 'common/components/adCompass'

	export default {
	    props: {
	        adData: object,
            apiActi: {
                type: String,
                default: ""
            },
		    apiBind: {
                type: String,
                default: ""
		    },
		    apiCode: String,
		    boundMobile: null,
            ajaxUrl: null,
            isLogin: {
                type: String,
            },
            agreement: Object,
            size: String
	    },
	    data() {
	        return {
                isBindMobileShow: false,
                nowParams: null,
                closeBtnShow: true,
	        }
	    },
        components: {
            adCompass
        },
        mounted() {
            this.handleWinHeight();
        },
		methods: {
	        hide() {
	            this.$emit("hide-layer");
	        },
			onContentClicked(ev) {
	            const vm = this;
	            ev.stopPropagation();
				vm.openTarget(vm.adData.params, vm.adData.url, vm.hide.bind(vm));
			},
            openTarget(str, fallback, cb) {
                const vm = this;
                str = str || vm.adData.params;
                fallback = fallback || vm.adData.fallback;
                    let _params = vm.parseParams(str);
                if (_params) {
                    vm.openActi(_params, cb)
                } else {
                    if(browser.WX){
                    	fallback && location.assign(fallback);
                    }else{
                    	fallback && webBridge.openUrl(fallback);
                    }
	                cb && cb();
                }
            },
            openActi(params, cb) {
                const vm = this;
                let loginData = storageMessager.getItem("isLogin", 0.5);
                if(vm.isLogin == '0' && !browser.WX && !loginData){
                    vm.nowParams = params;
                    storageMessager.send("loginSuc","");
                    webBridge.openUrl(this.ajaxUrl.urlLogin, "blank", 1);
                    return;
                }else if (params.is_login == "1" && !vm.boundMobile && !loginData) { // 去绑定手机
                    vm.showBindMobile();
                    vm.nowParams = params;
                    return;
                }
                vm.nowParams = null;
                vm.$http.post(vm.apiActi, Object.assign({
	                isbind: vm.boundMobile
                }, params))
                    .then(res => {
                        if(browser.WX){
                        	location.assign(res.data);
                        }else{
                        	webBridge.openUrl(res.data);
                        }
                        cb && cb();
                    })
                    .catch(errData => {
                        dialogManager.toast(errData.msg || "请求异常");
                        cb && cb();
                    })
            },
            parseParams(str) {
                let re = /^(?:\{\s*\}|\[\s*\])$/;
                if (!str || re.test(str)) {
                    return false;
                }
                let obj = JSON.parse(str);
                obj.rt = obj.r;
                return obj;
            },
            bindMobileSuccess() {
                const vm = this;
                vm.boundMobile = 1;
                vm.openActi(vm.nowParams);
            },
            showBindMobile() {
                this.isBindMobileShow = true;
            },
            handleWinHeight() {
                let winH = window.innerHeight;
                let newWinH = winH * 750 / window.innerWidth;
                if (newWinH < 1206 + 70) {
                    this.closeBtnShow = false;
                }
            }
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../style/_mixin.scss';

	.container {
		position: relative;
//		@include display-flex();
		@include justify-content(center);
		@include align-items(center);
		height: 100vh;
	}

	.content {
		@include display-flex();
		@include justify-content(center);
		text-align: center;
		height: 60%;
		margin: rem(203px 75px auto);
        @include radius(rem(10px));
		overflow: hidden;

		>img {
			height: 100%;
			width: 100%;
		}

        &.fullscreen {
            margin: 0;
            @include radius(0);
            height: rem(1206);

            >img {
                width: 100%;
                height: auto;
            }
        }
	}

	.footer {
		@include wh(75px);
		margin: rem(75px auto);
		.close {
			left: 50%;
			@include plus();
			@include transform(rotate(45deg));
		}

        &.fullscreen {
            position: fixed;
            bottom: rem(34);
            left: 0;
            width: 100%;
            height: rem(75);
            line-height: rem(75);
            margin: 0;
            text-align: center;

            .close-full {
                display: inline-block;
                width: rem(56);
                height: rem(56);
                @include plus(rem(45));
                @include transform(rotate(45deg) translatey(rem(12)));
                border-width: rem(1);
                border-style: solid;
                @include radius(rem(56px));
            }
        }
	}
</style>