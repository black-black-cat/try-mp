<template>
	<div class="m-popup-ad container" @click="hide">
		<div class="content" @click="onContentClicked">
			<lazy-image :src="adData.img"></lazy-image>
		</div>
		<div class="footer" @click="hide">
			<i class="close"></i>
		</div>
		<bind-mobile :show.sync="isBindMobileShow" :subUrl="apiBind" :url="apiCode"
		             @onBindSuccess="bindMobileSuccess"
		></bind-mobile>
	</div>
</template>

<script>
    import {object} from "common/utils/defaultProps";
    import dialogManager from "common/plugin/dialog";
    import browser from "lib/util/browser"
	import webBridge from "common/utils/webBridge"

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
		    boundMobile: null
	    },
	    data() {
	        return {
                isBindMobileShow: false,
                nowParams: null,
	        }
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
                    	location.assign(fallback);
                    }else{
                    	webBridge.openUrl(fallback);
                    }
	                cb && cb();
                }
            },
            openActi(params, cb) {
                const vm = this;
                if (params.is_login == "1" && !vm.boundMobile) { // 去绑定手机
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
                        	webBridge.openUrl(fallback);
                        }
                        cb && cb();
                    })
                    .catch(errData => {
                        dialogManager.toast(errData.msg || "请求异常");
                        cb && cb();
                    })
            },
            parseParams(str) {
                let re = /^\{\s*\}$/;
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
            }
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/style/mixin';

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
	}

	.footer {
		@include wh(75px);
		margin: rem(75px auto);
		.close {
			left: 50%;
			@include plus();
			@include transform(rotate(45deg));
		}
	}
</style>