<template>
	<div class="card" @click="openTarget">
		<div class="row-1">
			<lazy-image :src="imgSrc" initSrc="/images/common/702x286.jpg"></lazy-image>
		</div>
		<div class="row-2">{{title}}</div>
		<div class="row-3" v-if="!exceptive">
			<!--v-html="`${data.startDate} ${data.startTime}`"-->
			<div class="row-left">{{data.activitySubTitle}}</div>
			<div class="row-right">
				<i class="icon icon-eye"></i>
				<span>{{data.views > 999 ? "999+" : data.views}}</span>
				<i class="icon" :class="[thumbStyle]"></i>
				<span class="thumb-count" :class="{active: liked}" @click.stop="toggleThumb">
					{{data.likes > 999 ? "999+" : data.likes}}
					<span class="area"></span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
    import query from "lib/json/query"
    import dialogManager from "common/plugin/dialog"
    import openUrl from "common/utils/openUrl"
    import {lock, unLock, isLock} from "lib/comp/bus"
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    import storageMessager from "lib/util/storageMessager"

    export default {
        props: {
            imgSrc: {
                type: String,
                default: ""
            },
            title: {
                type: String
            },
            desc: null,
            data: {
                type: Object,
                default: {}
            },
            exceptive: false,
            apiActi: {
                type: String,
                default: ""
            },
	        index: Number,
            boundMobile: null,
	        hrefs: Object,
	        isLogin:{
	        	type: String
	        },
	        urlLogin:String
        },
	    data() {
            return {
                apiIsThumb: this.hrefs.apiIspraise,
	            apiThumb: this.hrefs.apiDopraise,
	            apiBrowsed: this.hrefs.apiScan,
	            liked: this.data.liked
            }
	    },
	    computed: {
			thumbStyle() {
			    return this.liked ? "icon-thumb-active-1" : "icon-thumb";
			}
	    },
        components: {},
        methods: {
            openTarget() {
                const vm = this;
                const data = vm.data;
				data.redirectType = data.redirectType || data.type;
				data.redirectParams = data.redirectParams || data.params

                if (data.redirectType == "act_play") {
                    let obj = vm.parseParams(data.redirectParams)
					vm.openActi(obj)
                }
                if (data.redirectType == "normal" && data.redirectUrl) {
                    openUrl(data.redirectUrl);
                    vm.postBrowsed();
                }
                if (data.redirectType == "film_detail") {
                    openUrl(vm.hrefs.urlFilm, {film_code: JSON.parse(data.redirectParams).filmCode});
                    vm.postBrowsed();
                }
            },

	        openActi(params) {
                const vm = this;
                let loginData = storageMessager.getItem("isLogin", 0.5);
                params = params || vm.nowParams;
                if(!browser.WX && vm.isLogin == 0 && !loginData){
                	vm.nowParams = params;
                	storageMessager.send("loginSuc","");
                	webBridge.openUrl(vm.urlLogin, "blank", 1);
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
//                        console.dir(res)
                        openUrl(res.data);
                        vm.postBrowsed();
                    })
                    .catch(errData => {
                        dialogManager.toast(errData.msg || "请求异常")
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

            showBindMobile() {
                this.$emit("showBindMobile", this.index)
            },
            toggleThumb() {
                const vm = this;
                if (isLock()) {
                    return;
                }
                vm.lock();
                vm.isThumb()
	                .then((res) => {
                        let data = res.data || {}
                        let isGoingActive = data.status == 0;
                        vm.$http.post(vm.apiThumb, {
                            status: isGoingActive ? 1 : 0,
	                        type: "ads",
	                        id: vm.data.activityNo
                        }).then((res) => {
                            let data = res.data;
                            dialogManager.toast(data.msg || res.msg);
                            vm.data.likes = vm.data.likes + (isGoingActive ? 1 : (-1))
                            vm.liked = vm.data.liked = isGoingActive;
                            vm.unlock();
                        })
	                })
	                .catch((errData) => {
                        dialogManager.toast(errData.msg || "请求异常");
                        vm.unlock();
	                })

            },

	        isThumb() {
                const vm = this;
                return vm.$http.get(vm.apiIsThumb, {
                    params: {
                        type: "ads",
                        id: vm.data.activityNo
                    }
                })
	        },

	        postBrowsed() {
				const vm = this;
				vm.$http.post(vm.apiBrowsed, {
                    type: "ads",
                    id: vm.data.activityNo
				}).then((res)=> {
				    vm.data.views += 1;
				});
                vm.setInitialSlide();
	        },

	        setInitialSlide() {
                localStorage.setItem("find.initialSlide", 1);
	        },

	        lock() {
                lock();
                dialogManager.wait();
	        },

	        unlock() {
                unLock();
                dialogManager.closeWait();
	        }
        }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.card {
		@include display-flex();
		@include flex-direction(column);
		@include justify-content(flex-start);
		width: r(702);
		min-height: r(430);
		margin: rem(36px auto 36px auto);
		padding-bottom: r(30);
		@include radius(rem(10px));
		@include box-sizing(border-box);

		.row-1 {
			height: r(286);
			@include radius(rem(10px) rem(10px) 0 0);
			overflow: hidden;
			> img {
				width: 100%;
				height: 100%;
			}
		}

		.row-2,
		.row-3 {
			padding: rem(30px 14px 0);
		}

		.row-2 {
			@include font-size(34px);
			line-height: 1.5;
		}

		.row-3 {
			@include display-flex();
			@include justify-content(space-between);
			@include align-items(center);
			@include font-size(26px);
			.row-left {
				@include ellipsis(1 00%);
				margin-right: rem(20);
			}

			.row-right {
				@include display-flex();
				@include align-items(center);
				@include font-size(28px);

				> .icon {
					vertical-align: middle;
				}

				> span {
                    @include flex-grow(0);
					width: 3em;
					text-indent: 0.5em;
				}

				.icon-acti-eye {
					margin-top: r(-3);
				}

				.icon-acti-thumb {
					margin-top: r(-6);
				}

				.thumb-count {
					position: relative;
					>.area {
						position: absolute;
						right: 0;
						top: 50%;
						@include translate(0, -50%);
						@include wh(200%, 200%);

					}
				}
			}
		}
	}
</style>
