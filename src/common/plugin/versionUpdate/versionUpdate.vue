<template>

</template>

<script>
	import popup from "lib/layer/popup";
	import {bind, bus, get} from 'lib/comp/bus'
	import verContent from "./versionUpdateContent";
	import {object} from "common/utils/defaultProps";
	import urlUtil from "lib/util/URL";

	export default {
	    props: {
	        appInfo: Object,
	        show: Boolean,
	        hasNew: Boolean,
	        page:{
	        	type: String
	        }
	    },
	    data() {
	        return {
	            m_ver: null,
		        dates: null,
		        cinema: ""
	        }
	    },
		mounted() {
	        const vm = this;	        
	        const tpl = '<ver-content @hide="hide" ref="ver" :app-info="appInfo" :has-new="hasNew"></ver-content>';
	        this.m_ver = popup(tpl, {
                option: {
                    overlay: {
                        opacity: "0.6"
                    },
                },
	            popup: {
                    data() {
                        return {
                            appInfo:vm.appInfo,
                            hasNew: vm.hasNew
                        }
                    },
	                components: {
	                    verContent
	                },
		            methods: {
	                    hide() {
	                        vm.m_ver.hide();
	                    }
		            }
	            }
	        });
	        // vm.m_ver.setFullScreen(true, true);
            vm.m_ver.setPosition(0, "auto", "auto", 0);	        
            bind(vm.m_ver.get("hide"), vm.changeShow);
		},
		methods: {
            getItem() {
                return sessionStorage.getItem("versionUpdate");
            },
            changeShow () {
                this.$emit('update:show', false);
            } 
		},
		watch: {
            show (bool) {
            	this.m_ver.setFullScreen(true, true);
                if((bool && !this.getItem() )|| (bool && this.page == "setting")) {
                    this.m_ver.show();
                    sessionStorage.setItem("versionUpdate", true);
                }else{
                    this.m_ver.hide();
                }
            },
            hasNew(bool){
            	this.m_ver.popup.$refs.ver.init(bool);
            }
        },
	}
</script>
