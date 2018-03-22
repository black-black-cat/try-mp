<template>
	<swiper :options="swiperOption" ref="swiper" v-if="images && images.length > 0">
		<swiper-slide v-for="(item, index) in images" :key="index">
			<div class="img-wrapper" @click="openTarget(item.params, item.url, item.type)">
                <lazy-image :src="item.img" init-src="/images/common/750x312.jpg"/>
                <ad-compass :ad='item' v-if='item.contentID'/>
			</div>
		</swiper-slide>
		<div class="swiper-pagination" slot="pagination"></div>
		<bind-mobile :show.sync="isBindMobileShow" :subUrl="apiBind" :url="apiCode"
		             @onBindSuccess="bindMobileSuccess"
		></bind-mobile>
	</swiper>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'
    import {array} from 'common/utils/defaultProps'
    import query from "lib/json/query"
    import dialogManager from "common/plugin/dialog"
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    import storageMessager from "lib/util/storageMessager"
    import {bus, get} from "lib/comp/bus"
    import adCompass from 'common/components/adCompass'

    export default {
        props: {
            images: Array,
	        apiActi: {
                type: String,
		        default: ""
	        },
	        apiBind: {
                type: String,
                default: ""
	        },
	        apiCode: {
                type: String,
                default: ""
	        },
            boundMobile: null,
            isLogin:{
                type: String
            },
            ajaxUrl: null
        },
        data () {
            return {
                isBindMobileShow: false,
                targetUrl: "",
	            nowParams: null,
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 3000
                },
            }
        },
        components: {
            swiper,
            swiperSlide,
            adCompass
        },
        methods: {
            openTarget(str, fallback, openType, startTime="", endTime="") {
                const vm = this;
                let _params = vm.parseParams(str);
                if (openType == "act_play") {
                    vm.openActi(_params, startTime, endTime)
                } else if (openType == "normal") {
                    if(browser.WX){
                        location.assign(fallback);
                    }else{
                        webBridge.openUrl(fallback);
                    }
                }
            },
	        openActi(params) {
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
	                })
	                .catch(errData => {
                        dialogManager.toast(errData.msg || "请求异常")
	                })
	        },
            setTargetUrl(str, fallback) {
                str = str || "{}";
                let obj = JSON.parse(str);
                if (!obj.url) {
                    return fallback;
                }

                let url = obj.url.replace(/\?$/, "");
                delete obj.url;
                url = query.url(url, obj);
                if (obj.is_login == "0") {
                    this.showBindMobile();
                    this.targetUrl = url;
                    return ""
                }
                return url;
            },
	        parseParams(str, startTime, endTime) {
                let re = /^\{\s*\}$/;
                if (!str || re.test(str)) {
                    return false;
                }
                let obj = JSON.parse(str);
                obj.rt = obj.r;
                obj.starttime = startTime;
                obj.endtime = endTime
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
	@import "../style/mixin";
	.swiper-container{
		@include wh(100%, 312px);
		.img-wrapper {
			@include wh(100%, 100%);
		}
		img{
			@include wh(100%, 100%);
		}
	}
</style>