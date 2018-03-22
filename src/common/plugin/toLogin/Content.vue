<template>
    <div class="m-login-views">
        <div class="header">              
            <div class="m-title">
                <i v-if="hide != 0"  class="icon-close_1"  @click="close"></i>
                <div class="title">请登录</div>
                <div @click="toReg" class="to-reg">
                    <span class="text">注册</span><i class="arrow-right"></i>
                </div>  
            </div>  
            <div class="logo vh-center">
                <lazy-image :src="biz_logo" init-src="/images/common/login_logo.png"/>
            </div>  
        </div>
        <div class="m-login-content">
            <div class="flex">
                <div class="vh-center"><div class="icon-mobile"></div></div>
                <input type="text" ref="mobile" placeholder="请输入手机号码"/>
            </div>
            <div v-if="wayFlag" class="flex">
                <div class="vh-center"><div class="icon-pwd"></div></div>
                <input type="password" ref="pwd" placeholder="请输入密码"/>
            </div>
            <div v-if="!wayFlag" class="flex">
                <div class="vh-center"><div class="icon-key"></div></div>
                <input type="text" ref="code" onkeyup="this.value=this.value.replace(/\D/g,'').substr(0, 6)" placeholder="请输入验证码"/>
                <div class="getCode" :class="{gray: isSend}" @click="sendCode">{{text}}</div>
            </div>
            <div class="tips" v-if="wayFlag">提示：如未设置过密码，可用手机号快捷登录</div>
            <div class="tips" v-if="!wayFlag"></div>
            <div class="button" @click="submit">登录</div>
            <div class="msg">
                <div v-if="wayFlag" @click="change">手机号快捷登录</div><div v-if="wayFlag" @click="toFindPwd">找回密码</div>
                <div v-if="!wayFlag" @click="change">账号密码登录</div>
            </div>
        </div>
        <div class="m-login-wx" v-if="other">
            <div class="ways">其他登录方式</div>
            <div class="vh-center">
                <div class="icon-wechat"></div>
            </div>
        </div>
    </div> 
</template>
<script>
import regular from 'lib/form/regular'
import dialogManager from 'common/plugin/dialog'
import delay from 'lib/util/delay'
import base64 from "lib/str/base64"
import inputControl from 'common/utils/inputControl'
import {isLock, lock, unLock} from 'lib/comp/bus'
import viewport from 'lib/comp/viewport'
import storageMessager from "lib/util/storageMessager"

export default {
    props: ["ajaxUrl", "agreement","hide"],
    data() {
        return {
            msg: '账号密码登录',
            wayFlag: true,
            isSend: false,
            second: 59,
            delay: null,
            inputControl: null,
            apiLogin: this.ajaxUrl.urlActLogin,
            apiRegiter: this.ajaxUrl.urlActRegister,
            apiSendcode: this.ajaxUrl.urlActSendcode,
            apiEditpwd: this.ajaxUrl.urlActEditpassword,
            apiFindPwd: this.ajaxUrl.urlActFindPassword,
            isRegister: null,
            other: false,
            biz_logo: this.agreement.biz_logo || "",
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
    },
    methods: {
        change() {
            const vm = this;
            vm.wayFlag = !vm.wayFlag;
        },
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
                    type: 20
                }
            }).then((res) => {
                if(res.data.data.isRegister) {
                    this.isRegister = res.data.data.isRegister;
                    dialogManager.confirm("该手机号未注册过账号！", {
                        okText: "立即注册",
                        cancelText:'取消',
                        ok: function() {
                             vm.$emit("reg",{
                                mobile: mobile,
                                delay: true
                             });
                        },
                        cancel:function(){
                            vm.$emit("close");
                        }
                    });
                }else{
                    dialogManager.toast("验证码已经发送!");
                    this.isSend = true;
                    this.delay.run();
                }
            }).catch((res) => {
                if(res.res.code == -2){
                    dialogManager.confirm("该手机号未注册过账号！", {
                        okText: "立即注册",
                        cancelText:'取消',
                        ok: function() {
                             vm.$emit("reg",{
                                mobile: mobile
                             });
                        }
                    });
                }else{
                    dialogManager.toast(res.msg);
                }                
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
            const vm = this;
            const mobile = vm.$refs.mobile.value.trim();
            let pwd = vm.wayFlag ?  vm.$refs.pwd.value.trim() : '';
            const code = vm.wayFlag ? '' : vm.$refs.code.value.trim();
            let url = null;
            /*if(vm.isRegister && !vm.wayFlag){
                url = vm.apiRegiter;
                pwd = '888888';
            }else{*/
                url = vm.apiLogin;
                vm.isRegister = null;
            // }
            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式错误！");
                return;
            }
            if(vm.wayFlag) {
                if(pwd.length == 0){
                    dialogManager.toast("密码不能为空！");
                    return;
                }
            } else {
                if(!regular.number(code) || code.length < 6){
                    dialogManager.toast("验证码为6位数字！");
                    return;
                }
            }
            vm.init(); 
            if(vm.isLock) return;
            vm.lock();
            vm.$http.get(url, {
                params: {
                    mobile: mobile,
                    password: base64.encode(pwd),
                    code: code
                }
            }).then(res => {
                /*if(vm.isRegister){
                    dialogManager.alert("注册成功，初始密码为 888888,请及时修改", {
                        okText: "我知道了",
                        ok: function() {
                            vm.$emit("suc"); 
                        }
                    });
                }else{*/
                    dialogManager.toast("登录成功");
                    storageMessager.send("isLogin", {isLogin: true, isBind:true });
                    vm.$emit("suc"); 
                // }                
                vm.unLock();
                               
            }).catch(res => {
                vm.unLock();
                dialogManager.toast(res['msg']);
            })
        },
        close(){
            this.$emit("close");
        },
        lock() {
            lock();
            dialogManager.wait();
        },
        unLock() {
            unLock();
            dialogManager.closeWait();
        },
        toReg(){
            this.$emit("reg",{
                mobile:this.$refs.mobile.value.trim()
            });
        },
        toFindPwd(){            
            this.$emit("pwd",{
                mobile:this.$refs.mobile.value.trim()
            });
        }
    },    
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
            text-align: center;
            position: relative;
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
                width: rem(238px);
                font-size: rem(28px);
                line-height: rem(42px);
                text-align: center;
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
        ::-webkit-input-placeholder {
            font-size: rem(32px);
        }
        .tips {
            height:rem(100px);
            line-height: rem(100px);
            font-size: rem(24px);
            text-align: center;
        }
        .button {
            height: rem(82px);
            @include radius(rem(41px));
            font-size: rem(36px);
            line-height: rem(82px);
            text-align: center;
        }
        .msg {
            @include display-flex(flex);
            @include justify-content(space-between);
            padding: rem(50px 30px 100px 30px);
            font-size: rem(26px);
            >div{
                text-decoration: underline;
            }
        }
    }
    .m-login-wx{
        margin-top: rem(240px);
        .ways{
            text-align: center;
            margin-bottom: rem(37px);
        }
    }
}
</style>
