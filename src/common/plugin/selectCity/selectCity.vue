<template></template>
<script>
    import popup from 'lib/layer/popup'
    import pluginContent from './content'
    import {bind, bus} from 'lib/comp/bus'
    import dialogManager from 'common/plugin/dialog'
    import query from 'lib/json/query'
    import browser from "lib/util/browser"
    import urlUtil from "lib/util/URL"

    let queryParams = query.parse(location.search.slice(1));
    let urlParams = urlUtil.parse(location.href);

    export default {
        props: {
            show: Boolean,
            url: {
                type: String,
                default: "/city/list"
            },
            callbackUrl: {
                type: String,
                default: location.pathname
            },
	        initialCityCode: null,
	        targetPathname: {
                type: String,
                default: location.pathname
	        },
            className:String
        },
        data () {
            return {
                m_select: null
            }
        },
        mounted () {
            const self = this;
            self.m_select = popup("<plugin-content @close='close' :url='url' :class-name='className' ref='content' :initial-city-code='initialCityCode'></plugin-content>", {
                option: {
                    animate: {
                        name: "slide-right"
                    }
                },
                popup: {
                    data () {
                        return {
                            url: self.url,
	                        initialCityCode: self.initialCityCode,
                            className:self.className
                        }
                    },
                    components: {
                        "plugin-content": pluginContent,
                    },
                    methods: {
                        close (opt) {
                            if (!opt) {
                                self.m_select.hide();
                                return;
                            }
                            const data = opt.data;
                            let params = {
//                                url: self.callbackUrl,
                                a: opt.cityCode,
                            };
                            params = Object.assign({}, urlParams.queryJson, params);
                            self.$emit("select", opt);
                            self.m_select.hide();
                            location.assign(query.url(self.targetPathname, params));
                        }
                    }
                }
            });
            self.m_select.setFullScreen(true, true);
            self.m_select.setPosition("auto", 0, 0, "auto");
            self.show && self.m_bind.show();
            bus.$once(self.m_select.get("show"), self.m_select.popup.$refs.content.initView);
            bind(self.m_select.get("hide"), self.changeShow);
        },
        methods: {
            changeShow () {
                this.$emit('update:show', false);
            }
        },
        watch: {
            show (bool) {
                const vm = this;
                if(bool) {
                    // if(browser.WX){
                    //     this.m_select.popup.$refs.content.weChatLocation();
                    // }else{
                    //     this.m_select.popup.$refs.content.getLocation();
                    // }
                    webBridge.onBackPressed = function () {                        
                        vm.m_select.hide();  
                        var isIPhone = navigator.appVersion.match(/iphone/gi);
                        if (isIPhone) {
                            return "turnBackSucceed";
                        }   
                    }
                    this.m_select.show();
                }else{
                    webBridge.onBackPressed = null;
                    this.m_select.hide();
                }
            }
        }
    }
</script>