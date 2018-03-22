<template>
</template>
<script>
import popup from "lib/layer/popup";
import cinema from "./content.vue";
import {
    bind,
    bus
} from "lib/comp/bus";
import dialogManager from "common/plugin/dialog";
import query from "lib/json/query";
import browser from "lib/util/browser";

export default {
    props: {
        show: Boolean,
        url: {
            type: String,
            default: "/cinema/list"
        },
        callbackUrl: {
            type: String,
            default: location.pathname
        },
        isShowCloseBtn: {
            type: Boolean,
            default: true
        },
        iphoneX: String
    },
    data() {
        return {
            m_select: null
        };
    },
    mounted() {
        const self = this;
        self.m_select = popup(
            "<cinema @close='close' :url='url' :iphone-x='iphoneX' ref='selectCinema' :close-show='isShowCloseBtn' />", {
                option: {
                    animate: {
                        name: "slide-right"
                    }
                },
                popup: {
                    data() {
                        return {
                            url: self.url,
                            isShowCloseBtn: self.isShowCloseBtn,
                            iphoneX: self.iphoneX
                        };
                    },
                    components: {
                        cinema
                    },
                    methods: {
                        close(opt) {
                            if (!opt) {
                                self.m_select.hide();
                                return;
                            }
                            const data = opt.data;
                            self.$emit("select", data);
                            self.m_select.hide();
                            self.changeShow();
                            let url = query.url(opt.url, {
                                url: self.callbackUrl,
                                a: data.area_code,
                                ci: data.cinema_code
                            });

                            if (browser.WX) {
                                location.replace(url);
                            } else {
                                webBridge.openUrl(url, "self");
                            }
                        }
                    }
                }
            }
        );
        self.m_select.setFullScreen(true, true);
        self.m_select.setPosition("auto", 0, 0, "auto");
        self.show && self.m_select.show();
        bus.$once(
            self.m_select.get("show"),
            self.m_select.popup.$refs.selectCinema.initShow
        );
        bind(self.m_select.get("hide"), self.changeShow);
    },
    methods: {
        changeShow() {
            this.$emit("update:show", false);
            //父模块绑定 :show.sync=""
        }
    },
    watch: {
        show(bool) {
            const vm = this;
            if (bool) {
                if (browser.WX) {
                    vm.m_select.popup.$refs.selectCinema.weChatLocation();
                } else {
                    vm.m_select.popup.$refs.selectCinema.getLocation();
                }
                webBridge.onBackPressed = function () {
                    vm.m_select.hide();
                    var isIPhone = navigator.appVersion.match(/iphone/gi);
                    if (isIPhone) {
                        return "turnBackSucceed";
                    }
                };
                vm.m_select.show();
            } else {
                vm.m_select.hide();
                webBridge.onBackPressed = null;
            }
        }
    }
};
</script>
