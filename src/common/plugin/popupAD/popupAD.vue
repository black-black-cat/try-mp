<template>

</template>

<script>
	import popup from "lib/layer/popup";
	import ad from "./popupADContent";
	import {object} from "common/utils/defaultProps";
	import urlUtil from "lib/util/URL";
	import browser from "lib/util/browser";

	export default {
	    props: {
	        adData: object,
		    apiActi: String,
		    apiBind: String,
		    apiCode: String,
		    boundMobile: null,
		    isFrontEndControl: {
	            type: Boolean,
			    default: false
		    },
		    ajaxUrl:object,
	    },
	    data() {
            let tuple = this.adData.title.split("#");
            this.adData.title = tuple[0]
	        return {
	            m_dialog: null,
		        dates: null,
		        cinema: "",
                size: tuple[1] || ""
	        }
	    },

		mounted() {
	        const vm = this;
	        if ( vm.isFrontEndControl && vm.isSameDate() ) {
				return;
	        }
	        const tpl = '<ad @hide-layer="hide" :ad-data="adData" :api-code="apiCode" :api-acti="apiActi" :bound-mobile="boundMobile" :api-bind="apiBind" :ajax-url="ajaxUrl" :size="size"></ad>';
	        vm.m_dialog = popup(tpl, {
                option: {
                    overlay: {
                        opacity: "0.8"
                    }
                },
	            popup: {
                    data() {
                        return {
                            adData: vm.adData,
	                        apiActi: vm.apiActi,
	                        apiBind: vm.apiBind,
	                        apiCode: vm.apiCode,
	                        boundMobile: vm.boundMobile,
	                        ajaxUrl: vm.ajaxUrl,
	                        agreement: vm.agreement,
                            size: vm.size
                        }
                    },
	                components: {
	                    ad
	                },
		            methods: {
	                    hide() {
	                        vm.m_dialog.hide();
	                    }
		            }
	            }
	        });
            vm.m_dialog.setPosition(0, "auto", "auto", 0);
            if(browser.WX){
            	vm.m_dialog.setFullScreen(true, true);
		        vm.m_dialog.show();
            }else{
            	setTimeout(()=>{//解决安卓页面未加载完成时innerWidth为0的情况
	            	vm.m_dialog.setFullScreen(true, true);
		        	vm.m_dialog.show();
	            },2000);
            }
		},
		methods: {
			isSameDate() {
	            const vm = this;
	            let cinema = vm.getCinema();
	            let memoDate = vm.getMemoDate(cinema);
	            let today = vm.getToday();
	            let isSame = memoDate == today;
	            if (!isSame) {
	                vm.rememberDate(today, cinema);
	            }
	            return isSame;
			},

            getToday() {
                let now = new Date();
                let today = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
                return today;
            },

			rememberDate(day, cinema) {
	            const vm = this;
	            if (!vm.dates) {
	                vm.dates = {}
	            }
	            vm.dates[cinema] = day;
                localStorage.setItem("index.ad.today", JSON.stringify(vm.dates));
			},
			getCinema() {
	            const vm = this;
	            vm.cinema = vm.cinema || urlUtil.parse(location.href).queryJson.ci;
	            return vm.cinema;
			},
			getMemoDate(cinema) {
			    const vm = this;
	            let dates
                let datesStr = localStorage.getItem("index.ad.today") || "";
                if (/^\{/.test(datesStr.trim())) {
                    dates = datesStr ? JSON.parse(datesStr) : {};
                    vm.dates = dates;
                    return dates[cinema] || null;
                } else {
                    localStorage.removeItem("index.ad.today");
                    return null
                }
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>