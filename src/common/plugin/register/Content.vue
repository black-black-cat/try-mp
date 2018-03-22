<template>
    <div class="m-login-views" >    
        <div class="header">
            <div class="m-title">
                <i v-if="hide != 0" class="icon-close_1"  @click="close"></i>
                <div class="title">请注册</div>
                <div @click="toLogin" class="to-reg">
                    <span class="text">登录</span><i class="arrow-right"></i>
                </div>  
            </div>  
            <div class="logo vh-center">
                <lazy-image :src="biz_logo" init-src="/images/common/login_logo.png"/>
            </div> 
        </div>       
        <div class="m-login-content">
            <div class="flex">
                <div class="vh-center"><div class="icon-mobile"></div></div>
                    <input type="text" ref="mobile" v-on:input="monitor" placeholder="请输入手机号码"/>
                </div>
            <div class="flex">
                <div class="vh-center"><div class="icon-pwd"></div></div>
                <input type="text" class="code-input" ref="code" v-on:input="monitor" placeholder="请输入验证码"/>
                <div class="getCode" :class="{gray: isSend}" @click="sendCode">{{text}}</div>
            </div>
            <div class="flex">
                <div class="vh-center"><div class="icon-key"></div></div>
                <input type="password" ref="pwd" v-on:input="monitor" placeholder="请输入6-20位字母、数字的密码"/>
            </div>
            <div class="flex no-border" v-if='policyTitle'>
                <span class="check" @click="check"><i :class="agree"></i></span>
                <div class="policy_text"><span class="text">我已阅读的并同意</span><span class="condtion" @click="policy">《{{policyTitle}}》</span></div>
            </div>
            <div class="register" ref="register" @click="submit">注册</div>
        </div>
    </div>    
</template>
<script>
import policy from './policy.vue';
import regular from 'lib/form/regular'
import dialogManager from 'common/plugin/dialog'
import delay from 'lib/util/delay'
import base64 from "lib/str/base64"
import inputControl from 'common/utils/inputControl'
import {isLock, lock, unLock, get} from 'lib/comp/bus'
import popup from 'lib/layer/popup'

export default {
    props: ["ajaxUrl","data","agreement","hide"],
    data() {
        return {
            isSend: false,
            second: 59,
            delay: null,
            inputControl: null,
            apiRegiter: this.ajaxUrl.urlActRegister,
            apiSendcode: this.ajaxUrl.urlActSendcode,
            agree: "" ,
            biz_logo: this.agreement.biz_logo || "",
            policyTitle:this.agreement.title || ""
        }
    },
    computed: {
        text () {
            if(!this.isSend) return "获取验证码";
            else return this.second + "秒可重发";
        }
    },
    mounted() {
        this.delay = delay(this.timer, 1000).bind(this);        
        this.inputControl = inputControl();
        this.inputControl.add(this.$refs.mobile);
        this.inputControl.add(this.$refs.code);
        this.inputControl.add(this.$refs.pwd);
    },    
    methods: {
        sendCode () {
            if(this.isSend) return;
            this.isSend = false;
            let vm = this;
            const mobile = this.$refs.mobile.value.trim();
            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式错误！");
                return;
            }
            dialogManager.wait();
            this.$refs.code.value = "";
            this.$http.get(this.apiSendcode, {
                params: {
                    mobile: mobile,
                    type:1
                }
            }).then((res) => {
                dialogManager.closeWait();
                dialogManager.toast("验证码已经发送!");
                this.isSend = true;
                this.delay.run();
            }).catch((res) => {
                dialogManager.closeWait();
                if(res.res.code == -2){
                    dialogManager.toast("该手机号已注册！")
                    /*dialogManager.confirm("该手机号已注册！", {
                        okText: "去登录",
                        cancelText:'取消',
                        ok: function() {
                             vm.$emit("close");
                        }
                    });*/
                }else{
                    dialogManager.toast(res.msg);
                }   
            });
        },
        init () {         
            this.second = 59;
            if(this.data && this.data.delay){
                this.isSend = true;
                this.delay.run();                
            }else{
                this.isSend = false;
                this.delay.cancel();
            }
        },
        initData(data){
            this.data = data;
            if( data ){
                this.$refs.mobile.value = data.mobile;
                this.isDelay = data.delay
            }
        },
        timer () {
            this.second--;
            if(this.second <= 0){
                this.init();
            }
        },
        submit () {
            const vm =this;
            const mobile = vm.$refs.mobile.value.trim();
            const code = vm.$refs.code.value.trim();
            const pwd = vm.$refs.pwd.value.trim();
            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式不正确！");
                return;
            }else if(!regular.number(code) || code.length < 6){
                dialogManager.toast("验证码为6位数字！");
                return;
            } else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(pwd))) {
                dialogManager.toast("请输入6-20位字母、数字的密码！");
                return;
            }else if(!vm.agree){
                dialogManager.toast("请阅读并同意购票协议！");
                return;
            }
            vm.init();
            if(vm.isLock) return;
            vm.lock();
            vm.$http.get(vm.apiRegiter, {
                params: {
                    mobile: mobile,
                    code: code,
                    password: base64.encode(pwd)
                }
            }).then(res => {
                dialogManager.toast("注册成功");
                vm.unLock();
                this.$emit("suc");
            }).catch(res => {
                vm.unLock();
                console.error(res);
                dialogManager.toast(res["msg"]);
            })
        },
        lock() {
            lock();
            dialogManager.wait();
        },
        unLock() {
            unLock();
            dialogManager.closeWait();
        },
        monitor() {
            const vm = this;
            const mobile = vm.$refs.mobile.value.trim();
            const code = vm.$refs.code.value.trim();
            const pwd = vm.$refs.pwd.value.trim();
            if(!!mobile && !!code && !!pwd) {
                vm.$refs.register.style.opacity = '1';
            } else {
                
                vm.$refs.register.style.opacity = '0.5';
            }
        },
        check: function(ev) {
            const vm = this;
            vm.agree = vm.agree ? "" :"icon-hook2";
        },
        policy() {
            const vm = this;
            if(vm.agreement && !vm.agreement.content) return;
            vm.m_dialog_policy = popup("<policy @close='close' :options='options'></policy>", {
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data() {
                        return {
                            options: vm.agreement
                        };
                    },
                    methods: {
                        close() {
                            vm.m_dialog_policy.hide();
                        }
                    },
                    components: {
                        policy
                    }
                }
            });
            vm.m_dialog_policy.show(0, "auto", "auto", 0);
        },
        close(){
            this.$emit("close");
        },
        toLogin(){
            this.$emit("close");
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../common/style/mixin";

.m-login-views {
    height:100vh;
    .arrow-right {
        @include arrow-right(0,8px);
        margin-left: rem(20px);
        top:rem(-28px);
        left:rem(30px);
    } 
    .header {
        font-size: rem(34);
        position: relative;
        height: rem(275px);
        .m-title{
            padding: rem(59px 36px 0 36px);
            position: relative;
            text-align: center;
            .icon-close_1{
                position: absolute;
                top:rem(59px);
                left:rem(34px);
            }
            .to-reg{
                position: absolute;
                right:rem(34px);
                top:rem(59px);
            }

        }
        .logo{
            margin:rem(45px 302px 60px 302px);
            position: absolute;
            top:rem(96px);
            @include wh(146px, 146px);            
            img{
                width:100%;
                @include radius(rem(32px));
            }
        }
    }
    .m-login-content {
        padding: rem(0 70px);
        .flex{
            @include display-flex(flex);
            @include align-items(center);
            height: rem(100px);
            .vh-center {
                width: rem(60px);
            }
            .getCode {
                width: rem(270px);
                font-size: rem(28px);
                line-height: rem(42px);
                text-align: center;
            }
            &.no-border::before{
                border:none!important;                                             
            }
        }
        .flex:nth-child(n+1) {
            margin-top: rem(28px);
        }
        
        input {
            padding-left: rem(12px);
            border: none;
            font-size: rem(32px);
            height:100%;
            width: 100%;
        }
        .code-input{
            width:80%;
        }
        ::-webkit-input-placeholder {
            font-size: rem(32px);
        }
        .policy_text{
            line-height: rem(50px);
        }
        .register {
            margin-top: rem(50px);
            height: rem(82px);
            @include radius(rem(41px));
            font-size: rem(36px);
            line-height: rem(82px);
            text-align: center;
            @include opacity(50);
            @include transition(all ease-in 400ms);
        }
        .check {
            @include wh(40px, 40px);
            margin-right: rem(16px);
            @include radius(100%);
            font-size:rem(24px);
            //text-align: center;
            .icon-hook2 {
                position: relative;
                top: rem(10px);
                left: rem(4px);
            }
        }

    }
}
</style>
