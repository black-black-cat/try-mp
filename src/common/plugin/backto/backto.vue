<template>
    <div class="m-backto">
        <div class="backto-home vh-center" v-if="homeUrl" @click="backtoHome">
            <i class="icon-backto-home"></i>
        </div>
        <div class="backto-top vh-center" v-if="isBacktoTopShow" @click="backtoTop">
            <i class="icon-backto-top"></i>
        </div>
    </div>
</template>

<script>

import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: {
        listened: null,
        duration: {
            type: Number,
            default: 400
        },
        animated: {
            type: Boolean,
            default: true
        },
        distance: {
            type: Number,
            default: window.innerHeight / 2
        },
        btnType: {
            type: String,
            // top | home | both
            default: "top"
        },
        homeUrl: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            isBacktoTopShow: false,
        }
    },
    computed: {
        btnTopShow() {
            return this.btnType === "top" || this.btnType === "both";
        },
        btnHomeShow() {
            return this.btnType === "home" || this.btnType === "both";
        }
    },
    mounted() {
        this.listenScroll();
    },
    methods: {
        listenScroll() {
            const vm = this;
            let el = vm.listened;
            el.addEventListener("scroll", function () {
                vm.isBacktoTopShow = vm.scrollTop() > vm.distance;
            }, false);
        },
        backtoTop() {
            const vm = this;
            if (vm.animated) {
                return vm.backtoTopAnim();
            }
            vm.scrollTop(0);
        },
        backtoTopAnim() {
            const vm = this;
            let dur = vm.duration;
            let stepTime = 1000 / 60;
            let length = vm.scrollTop();
            let stepLength = length * stepTime / dur;

            function step() {
                let nowScrollTop = vm.scrollTop();
                if (nowScrollTop <= 0) {
                    return;
                }
                setTimeout(() => {
                    let nowScrollTop = vm.scrollTop();
                    vm.scrollTop(nowScrollTop - stepLength);
                    nowScrollTop = vm.scrollTop();
                    if (nowScrollTop > 0) {
                        step();
                    }
                }, stepTime);

            }
            step();
        },
        scrollTop(num) {
            const vm = this;
            let _scrollTop = 0;
            let isSet = typeof num === "number";
            if (vm.listened === document.body || vm.listened === document.documentElement) {
                if (isSet) {
                    document.body.scrollTop = num;
                    document.documentElement.scrollTop = num;
                } else {
                    _scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                }
            } else {
                if (isSet) {
                    vm.listened.scrollTop = num;
                } else {
                    _scrollTop = vm.listened.scrollTop;
                }
            }
            return isSet || _scrollTop;
        },
        backtoHome() {
            if(browser.WX){
                location.assign(this.homeUrl);
            }else{
                webBridge.popToSelectedController(this.homeUrl);
            }            
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/_mixin.scss";

.m-backto {
    position: fixed;
    bottom: rem(120px);
    right: rem(24px);

    .backto-top, .backto-home {
        @include wh(72px, 72px);
        @include radius(rem(72px));
        margin: rem(24px, auto);
    }

}
</style>
