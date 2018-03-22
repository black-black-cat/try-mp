<template>
    <div class="m-error">
        <div class="row-1">
            <lazy-image :src="imgUrl"></lazy-image>
        </div>
        <div class="row-2">{{msg}}</div>
        <div class="m-btn-group">
            <button @click="onButtomClicked" v-if="refresh" class="vh-center btn">{{buttonText}}</button>
            <button @click="onBack" v-if="back" class="vh-center btn">返回</button>
        </div>
    </div>
</template>

<script>

import { bus, get } from 'lib/comp/bus';

    export default {
        props: {
            imgUrl: {
                type: String,
                default: "/images/common/error.png"
            },
            msg: {
                type: String,
                default: "暂无"
            },
            refresh: String,
            isButtonEvent: {
                type: Boolean,
                default: false
            },
            buttonText: {
                type: String,
                default: "重新加载"
            },
            back: {
                type: Boolean,
                default: false
            }
        },
        created(){
            let vm = this;
            bus.$on(get("back"), (data)=> {
                vm.back = data;
            })
        },
        methods: {
            onButtomClicked() {
                const vm = this;
                if (vm.isButtonEvent) {
                    vm.$emit("buttomClicked");
                } else {
                    vm.load();
                }
            },
            load () {
                // if(browser.WX){
                    window.location.replace(location.href);
                    // window.location.reload();
                /*}else{
                    webBridge.reload();
                }*/
            },
            onBack(){             
                this.$emit("onBack");                       
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../style/mixin";
.m-error {
    display: inline-block;
    width: r(400);

    .row-1 {
        text-align: center;
        height: r(60);

        >img {
            height: 100%;
        }
    }

    .row-2 {
        padding-top: r(20);
        text-align: center;
        line-height: 1.5;
        font-size: r(26);
        word-wrap: break-word;
    }
    .m-btn-group{
        @include display-flex(flex);
        @include justify-content(center);
        @include align-items(center);
        .btn{
            display: block;
            @include box-sizing;
            @include wh(200px, 62px);
            @include radius(rem(62px));
            @include font-size(32px);
            margin: rem(20px);
        }
    }
    
}
</style>
