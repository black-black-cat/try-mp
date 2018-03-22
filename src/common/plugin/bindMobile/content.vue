<template>
    <div class="m-bind-mobile" ref="container">
        <div class="title vh-center">
            <span class="name">绑定手机号码</span>
            <i class="icon-dialog-close" @click="close"></i>
        </div>
        <ul class="form-items" ref="one" @click="focusInput">
            <li class="item vh-left"><span class="vh-center"><i class="icon-mobile"></i></span><input type="number" ref="mobile" placeholder="请输入手机号"/></li>
            <li class="item vh-left" ref="oneOne">
                <span class="vh-center"><i class="icon-pwd"></i></span><input type="number" ref="code" onkeyup="this.value=this.value.replace(/\D/g,'').substr(0, 6)" placeholder="请输入验证码"/>
                <span class="code" :class="{gray: isSend}" @click.stop="sendCode">{{text}}</span>
            </li>
        </ul>
        <span class="btn vh-center" @click="submit">确定</span>
    </div>
</template>
<script>
    import regular from 'lib/form/regular'
    import dialogManager from 'common/plugin/dialog'
    import delay from 'lib/util/delay'
    import inputControl from 'common/utils/inputControl'
    import browser from "lib/util/browser"
    import closest from "lib/dom/closest"
    import {default as BodyFixed, move} from "common/utils/bodyFixed"

    export default {
        props: {
            url: {
                type: String,
                default: ""
            }
        },
        data () {
            return {
                isSend: false,
                second: 59,
                delay: null,
                inputControl: null,
            }
        },
        computed: {
            text () {
                if(!this.isSend) return "获取验证码";
                else return this.second + "秒可重发";
            }
        },
        mounted () {
            this.delay = delay(this.timer, 1000).bind(this);
            this.inputControl = inputControl();
            this.inputControl.add(this.$refs.mobile);
            this.inputControl.add(this.$refs.code);
            let bodyFixed = new BodyFixed();
            bodyFixed.init([this.$refs.mobile, this.$refs.code], this.$refs.container, {
                canMove: true
            });
        },
        methods: {
            close () {
                this.$emit("close");
            },
            sendCode () {
                if(this.isSend) return;
                this.isSend = false;
                const mobile = this.$refs.mobile.value.trim();
                if(!regular.mobile(mobile)){
                    dialogManager.toast("手机号格式不正确！");
                    return;
                }
                dialogManager.wait();
                this.$refs.code.value = "";
                this.$http.get(this.url, {
                    params: {mobile: mobile}
                }).then((res) => {
                    dialogManager.toast("验证码已经发送!");
                    this.isSend = true;
                    this.delay.run();
                }).catch((res) => {
                    dialogManager.alert(res.msg);
                });
            },
            init () {
                this.isSend = false;
                this.second = 59;
                this.delay.cancel();
            },
            timer () {
                this.second--;
                if(this.second <= 0){
                    this.init();
                }
            },
            submit () {
                const mobile = this.$refs.mobile.value.trim();
                const code = this.$refs.code.value.trim();
                if(!regular.mobile(mobile)){
                    dialogManager.toast("手机号格式不正确！");
                    return;
                }else if(!regular.number(code) || code.length < 6){
                    dialogManager.toast("验证码为6位数字！");
                    return;
                }
                this.init();
                this.$emit("click", {mobile: mobile, sms_code: code});
            },

            isNewApple () {
                let ua = navigator.userAgent;
                let re = /(iP.*OS)\s([\d_]+)/;
                let matched = ua.match(re);
                let arrVer

                if (matched && matched[0] && matched[2]) {
                    arrVer = matched[2].split("_");
                    return arrVer[0] >= 11
                }
                return false;
            },
            focusInput (ev) {
                const el = ev.target;
                const input = el.querySelector("input");
                input && input.focus && input.focus();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../common/style/mixin";
    .m-bind-mobile{
        width: rem(750px);
        padding-bottom: rem(408px);
        .title{
            @include height(100px);
            position: relative;
            .name{
                @include flex(1);
                @include font-size(32px);
                text-align: center;
            }
            .icon-dialog-close{
                @include top_center;
                right: rem(34px);
            }
        }
    }
    .form-items{
        // width: rem(750px);
        margin: rem(0 70px);
        @include box-sizing();
        .item{
            @include wh(610px, 130px);
            @include box-sizing;
            padding-top: rem(38px);
            overflow: hidden;
            input{
                @include flex(1);
                max-width: rem(340px);
                @include lh(40px);
                border: 0 none;
                text-indent: rem(25px);
                @include font-size(32px);
            }
            .code{
                display: inline-block;
                padding: rem(7px 0);
                @include font-size(28px);
                @include width(240px);
                text-align: center;
            }
        }
    }
    .btn{
        @include wh(610px, 82px);
        @include radius(rem(82px));
        @include font-size(36px);
        @include box-sizing;
        margin: rem(50px auto 0);
    }
</style>