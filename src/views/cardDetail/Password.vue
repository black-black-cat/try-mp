<template>
    <div class="m-card-password">
        <div>
            <div class="title">请输入会员卡密码</div>
            <div class="code" @click="code">
                <input type="text" ref="password" maxlength="6" v-on:input="write">
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
            </div>
            <div class="btn">
                <div class="cancel" @click="cancel">取消</div>
                <div class="ok" @click="ok">确定</div>
            </div>
        </div>
    </div>
</template>
<script>
import {bus} from 'lib/comp/bus';
export default {
    data() {

    },
    methods: {
        cancel() {
            this.$emit("close");
        },
        ok() {
            bus.$emit("password", this.$refs.password.value);
            this.$emit("close");
        },
        code () {
          const vm = this;
          vm.$refs.password.focus();
        },
        write() {
            const vm = this;
            const itemNode = document.querySelectorAll(".square");
            for(let i = 0; i < itemNode.length; i++) {
                if(i< vm.$refs.password.value.length) {
                    if(!itemNode[i].classList.contains("full-fill")) {
                        itemNode[i].classList.add("full-fill");
                    }
                } else {
                    itemNode[i].classList.remove("full-fill");
                }
            }
        }
    }
}  
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';

.m-card-password {
    width: rem(562px);
    padding: rem(0 94px);
    >div {
        @include radius(rem(10px));
    }
    .title {
        padding: rem(67px 0px 40px);
        font-size: rem(28px);
        text-align: center;
    }
    .btn {
        @include display-flex(flex);
        @include justify-content(space-between);
        padding: rem(64px 60px 50px 60px);
        >div {
            @include wh(200px, 68px);
            line-height: rem(68px);
            font-size: rem(28px);
            text-align: center;
            @include radius(rem(34px));
        }
    }
    .code {
        @include display-flex(flex);
        @include align-items(center);
        position: relative;
        padding: rem(0 36px);
    }
    .square {
        @include wh(80px, 80px);
        position: relative;
        border-right: none;
    }
    input {
        @include wh(0, 0);
        position: absolute;
        border: none;
        z-index: -9999;
    }
    .full-fill:after {
        content: '';
        position: absolute;
        left: rem(30px);
        top: rem(30px);
        @include wh(20px, 20px);
        @include radius(100%);
    }
}
</style>
