<template>
    <div class="m-order-payCard">
        <div class="title"><div>会员卡支付</div><div class="icon-dialog-close" @click="close"></div></div>
        <div class="layout-1" v-if="!!this.cardInfo"><div>{{this.cardInfo.cinemaName}}</div><div>{{this.cardInfo.cardno}}</div></div>
        <div class="layout-2">这笔订单你还需要支付：<span v-if="!!cardInfo.amount">{{parseFloat(cardInfo.amount)}}</span>元</div>
        <div class="layout-3">
            <p>请输入支付密码</p>
            <div class="password">
                <input type="password" ref="password" v-on:input="write">
                <!-- <div class="password-model" @click="code">
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                </div> -->
            </div>
            <!-- <p>忘记支付密码？</p> -->
        </div>
        <div class="layout-4" @click="paycard">确认支付</div>
    </div>
</template>
<script>
import dialog from 'common/plugin/dialog';
import {isLock, lock, unLock} from 'lib/comp/bus';
export default {
    props: ["options"],
    data() {
        return {
            password: '',
            cardInfo: {}
        }
    },
    methods: {
        code() {
            this.$refs.password.focus();
        },
        write() {
            const vm = this;
            let nodeList = document.querySelectorAll(".square");
            for (let i = 0; i < nodeList.length; i++) {
                if (i < vm.$refs.password.value.length) {
                    if (!nodeList[i].classList.contains("full-fill")) {
                        nodeList[i].classList.add("full-fill");
                    }
                } else {
                    nodeList[i].classList.remove("full-fill");
                }
            }
            vm.password = vm.$refs.password.value;
        },
        paycard() {
            const vm = this;
            let num = null;
            if (!vm.$refs.password.value) {
                dialog.toast("请输入密码");
                return;
            }
            vm.$emit("paycard", {password: vm.$refs.password.value});
            //vm.$emit("close");
            vm.clearInput();
        },
        close() {
            this.$emit("close");
            this.clearInput();
        },
        lock() {
            lock();
            dialog.wait();
        },
        unLock() {
            unLock();
            dialog.closeWait();
        },
        clearInput() {
            const vm = this;
            vm.$refs.password.value = '';
        }
    },
    watch: {
        options(val) {
            this.cardInfo = val;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-order-payCard {
    width: rem(750px);
    height: rem(854px);
    .title {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        padding: rem(0 34px 0);
        font-size: rem(32px);
        line-height: rem(100px);
        >div:nth-child(1) {
            @include flex(1);
            text-align: center;
        }
    }
    .layout-1 {
        @include display-flex(flex);
        @include justify-content(space-between);
        margin-left: rem(34px);
        padding-right: rem(34px);
        font-size: rem(32px);
        line-height: rem(100px);
        >div:nth-child(2) {
            font-size: rem(28px);
        }
    }
    .layout-2 {
        margin-left: rem(34px);
        font-size: rem(28px);
        line-height: rem(100px);
        span {
            font-size: rem(40px);
        }
    }
    .layout-3 {
        padding: rem(20px 34px 0 34px);
        font-size: rem(28px);
        .password {
            margin-top: rem(20px);
        }
        input {
            @include wh(576px, 52px);
            padding: rem(30px);
            line-height: normal;
            font-size: rem(75px);
        }
        .password-model {
            @include display-flex(flex);
        }
        .square {
            @include wh(106px, 112px);
            position: relative;
            border-right-width: 0;
        }
        .full-fill:before {
            content: '';
            position: absolute;
            top: rem(38px);
            left: rem(41px);
            width: rem(30px);
            height: rem(30px);
            @include radius(100%);
        }
        p:last-child {
            margin-top: rem(20px);
            text-align: right;
        }
    }
    .layout-4 {
        @include wh(683px, 90px);
        position: relative;
        left: rem(32.5px);
        margin-top: rem(260px);
        font-size: rem(38px);
        line-height: rem(90px);
        text-align: center;
        @include radius(rem(45px));
    }
}
</style>
