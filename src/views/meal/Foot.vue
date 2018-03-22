<template>
    <div>
        <div class="foot" v-if="snackArr.length">
            <div class="list">
                <template v-for="item in snack">
                    <div class="item1" v-if="item.count > 0">
                        <div :data-code="item.code">{{item.name}}x{{item.count}}<span @click="cancel"></span></div>
                    </div>
                </template>
            </div>
            <template v-if="payAmount > 0">
                <div class="item2">
                    <div><span class="waitpay">待支付</span>¥</div>
                    <div class="sum">{{parseFloat((payAmount).toFixed(2).toString())}}</div>
                    <!-- <template v-if="this.serviceFee > 0">
                        <div class="service">包含服务费¥{{this.serviceFee}}</div>
                    </template>
                    <template v-else>
                        <div class="service">未包含服务费</div>
                    </template> -->
                    <div class="payOrder" @click="submit">选好了</div>
                </div>
            </template>
        </div>
        <div class="height-holder" v-if="snackArr.length">

        </div>
    </div>
</template>
<script>

import {bus, isLock, lock, unLock, get} from 'lib/comp/bus';
import dialogManager from 'common/plugin/dialog';
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"

export default {
    props: ["options"],
    data() {
        return {
            payAmount: 0,
            snack: null,
            snackArr: [],
            serviceFee: 0,
        }
    },
    methods: {
        submit() {
            let vm = this;
            let loginData = storageMessager.getItem("isLogin", 0.5);
            if(vm.options.data.is_login == 0 && !browser.WX && !loginData){
                vm.unLock();
                storageMessager.send("loginSuc","");
                webBridge.openUrl(this.options.href.urlLogin, null, 1);
                return;
            }else if (vm.options.data.bindMobile != 1 && !loginData) {
                this.$emit("showMobile");
                return;
            }
            if (isLock()) {
                return;
            }
            vm.lock();
            this.$http.get(vm.options.href["apiLocksnack"],
                {
                    params: {
                        cinema_code: this.options.data.cinema_code,
                        snacks: this.snackArr.join(",")
                    }
                }
            ).then((res) => {
                let url = vm.options.href["urlOrderConfirm"];
                let divide = url.includes("?") ? "&" : "?";
                let newUrl = url + divide + 'order_code=' + res["data"]["order_code"] + '&itemname=snack';
                vm.unLock();
                if(browser.WX){
                    location.assign(newUrl);
                }else{
                    webBridge.openUrl(newUrl);
                }
            }).catch((req) => {
                dialogManager.toast(req["msg"]);
                vm.unLock();
            });
        },
        cancel(ev) {
            let vm = this;
            let code = ev.target.parentNode.dataset.code;
            vm.payAmount = 0;
            vm.serviceFee = 0;
            vm.snackArr = [];
            for (let item in vm.snack) {
                if (code == vm.snack[item].code) {
                    vm.snack[item].count = 0;
                }
                if (vm.snack[item].count > 0) {
                    if(!!vm.snack[item].connect_fee) {
                        //vm.serviceFee += vm.snack[item].connect_fee;
                        vm.payAmount += (Number(vm.snack[item].net_price)) * vm.snack[item].count;
                    } else {
                        vm.payAmount += vm.snack[item].net_price * vm.snack[item].count;
                    }
                    vm.snackArr.push(vm.snack[item].code + ':' + vm.snack[item].count);
                }
            }
        },
        lock() {
            lock();
            dialogManager.wait();
        },
        unLock() {
            unLock();
            dialogManager.closeWait();
        }
    },
    created() {
        bus.$on(get("snack"), (data) => {
            var vm = this;
            vm.snack = data;
            vm.payAmount = 0;
            vm.serviceFee = 0;
            vm.snackArr = [];
            for (let item in data) {
                if (data[item].count > 0) {
                    if(!!data[item].connect_fee) {
                        vm.payAmount += (Number(data[item].net_price)) * data[item].count;
                        //vm.serviceFee += data[item].connect_fee;
                    } else {
                        vm.payAmount += data[item].net_price * data[item].count;
                    }
                    vm.snackArr.push(data[item].code + ':' + data[item].count);
                }
            }
        })
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/mixin';

.m-views-meal .foot{
    position: fixed;
    bottom: rem(98px);
    width: 100%;
    z-index: 10;
    .item1 {
        padding: rem(20px 24px 0 24px);
        float: left;
    }
    .item1>div {
        display: inline-block;
        height: rem(44px);
        padding: rem(7px 20px);
        font-size: rem(30px);
        @include radius(rem(100px));
        span {
            margin-left: rem(10px);
            &:after{
                content: "\00D7";
                font-size: 120%;
            }
        }
    }
    // .item1:nth-child(n+3) {
    //     margin-top: rem(20px);
    // }
    .item2 {
        clear: both;
        @include display-flex(flex);
        @include flex-shrink(1);
        position: relative;
        padding-top: rem(40px);
        padding-bottom: rem(30px);
        font-size: rem(28px);
        .waitpay {
            padding-left: rem(24px);
            margin-right: rem(10px);
        }
        .sum {
            margin-top: rem(-10px);
            font-size: rem(42px);
        }
        .service {
            margin: rem(0 10px);
        }
        .payOrder {
            @include wh(300px, 90px);
            position: absolute;
            right: rem(24px);
            bottom: rem(10px);
            font-size: rem(38px);
            line-height: rem(90px);
            text-align: center;
            @include radius(rem(45px));
        }
    }
}

.height-holder {
    height: rem(286px);
}
</style>
