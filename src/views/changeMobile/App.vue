<template>
    <div class="m-change-mobile-views">
        <div class="content" v-if='iswx'></div>
        <div class="flex">
            <div class="vh-center"><div class="icon-mobile"></div></div>
            <input type="text" ref="old"  :disabled="isTrue" :class="{disabled: isTrue}" placeholder="请输入旧的手机号码"/>
        </div>
        <div class="flex" v-if="isTrue">
            <div class="vh-center"><div class="icon-mobile"></div></div>
            <input type="text" ref="new" placeholder="请输入新的手机号码"/>
        </div>
        <div class="flex" v-if="isTrue">
            <div class="vh-center"><div class="icon-pwd"></div></div>
            <input type="text" class="code-input" ref="code" placeholder="请输入验证码"/>
            <div class="getCode" :class="{gray: isSend}" @click="sendCode">{{text}}</div>
        </div>
        <div class="button" ref="confirm" @click="submit">{{subText}}</div>
        
    </div>
</template>
<script>
import dialogManager from 'common/plugin/dialog'
import {isLock, lock, unLock} from 'lib/comp/bus'
import regular from 'lib/form/regular'
import delay from 'lib/util/delay'
import base64 from "lib/str/base64"
import inputControl from 'common/utils/inputControl'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    data () {
        console.log(this.options);
        return {
            isSend: false,
            second: 59,
            delay: null,
            inputControl: null,
            isTrue:false,
            mobile:this.options.data.mobile,
            apiSendcode: this.options.href.urlActSendcode,
            subText:'下一步',
            iswx: browser.WX,
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
        this.inputControl.add(this.$refs.old);
        this.inputControl.add(this.$refs.new);
        this.inputControl.add(this.$refs.code);
    },
    methods: {
        sendCode () {
            if(this.isSend) return;
            this.isSend = false;
            let vm = this;
            const mobile = this.$refs.new.value.trim();
            const oldMobile = this.$refs.old.value.trim();
            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式错误！");
                return;
            }
            if(mobile == oldMobile){
                dialogManager.toast("新手机号与旧手机号一致！");
                return;
            }
            dialogManager.wait();
            this.$refs.code.value = "";
            this.$http.get(this.apiSendcode, {
                params: {
                    mobile: mobile,
                    type: 8
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
            const vm = this;
            const oldMobile = vm.$refs.old.value.trim();             
            if(!regular.mobile(oldMobile)){
                dialogManager.toast("旧手机号格式错误！");
                return;
            }
            if(!vm.isTrue){
                if(vm.mobile != oldMobile){
                    dialogManager.toast("手机号不正确，请重新输入！");
                    return;
                }
                vm.isTrue = true;
                vm.subText = "确认";
                return;
            }
            const newMobile = vm.$refs.new.value.trim();            
            const old = vm.$refs.old.value.trim();            
            const code = vm.$refs.code.value.trim();
            if(!regular.mobile(newMobile)){
                dialogManager.toast("新手机号格式错误！");
                return;
            }
            if(!regular.number(code) || code.length < 6){
                dialogManager.toast("验证码为6位数字！");
                return;                
            }             
            if(vm.isLock) return;
            vm.lock();
            vm.$http.get(vm.options.href.urlActResetmobile, {
                params: {
                    mobile: old,
                    new_mobile: newMobile,
                    code: code
                }
            }).then(res => {
                vm.unLock();
                dialogManager.toast("更换手机号成功"); 
                vm.init();
                setTimeout(()=>{
                    if(browser.WX){
                        location.replace(vm.options.href.urlMy);
                        // history.go(-1);  
                    }else{
                        webBridge.popToSelectedController(vm.options.href.urlMy);
                    }
                },600)                               
            }).catch(res => {
                vm.init();
                vm.unLock();
                dialogManager.toast(res['msg'] || '更换手机失败');
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
            const oldMobile = vm.$refs.old.value.trim();
            const newMobile = vm.$refs.new.value.trim();
            if(!!oldMobile && !!newMobile) {
                vm.$refs.confirm.style.opacity = '1';
            } else {
                vm.$refs.confirm.style.opacity = '0.5';
            }
        }
    }
}   
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-change-mobile-views {    
    padding:rem(0 70px);
    height:100vh; 
    .content{
        padding-top: rem(70px);
    }
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
        &:first-child{
            margin-top: 0;
        }
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
        margin-top: rem(56px);
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
    }
}
</style>
