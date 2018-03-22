<template>
    <section class="m-editpwd-views">
        <div class="flex">
            <div class="vh-center"><div class="icon-key"></div></div>
            <input type="password" ref="oldpwd" placeholder="请输入原密码">
        </div>
        <div class="flex">
            <div class="vh-center"><div class="icon-key"></div></div>
            <input type="password" ref="newpwd" v-on:input="monitor" placeholder="请输入6-20位字母、数字的新密码">
        </div>
        <div class="button" ref="confirm" @click="confirm">确认</div>
    </section>
</template>
<script>
import dialogManager from 'common/plugin/dialog'
import {isLock, lock, unLock} from 'lib/comp/bus'
import base64 from "lib/str/base64"
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"
export default {
    props: ["options"],
    data () {
        return {}
    },
    methods: {
        confirm() {
            const vm = this;
            const oldpwd = vm.$refs.oldpwd.value.trim();
            const newpwd = vm.$refs.newpwd.value.trim();
            if(!oldpwd) {
                dialogManager.toast("请输入原密码");
                return;
            }
            if(!newpwd) {
                dialogManager.toast("请输入新密码");
                return;
            }
            if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(newpwd))) {
                dialogManager.toast("请输入6-20位字母、数字的密码！");
                return;
            }else if(newpwd == oldpwd){
                dialogManager.toast("两次输入的密码一样，请重新输入！");
                return;
            }
            if(vm.isLock) return;
            vm.lock();
            vm.$http.get(vm.options.href.urlActEditpassword, {
                params: {
                    password: base64.encode(oldpwd),
                    new_password: base64.encode(newpwd)
                }
            }).then(res => {
                vm.unLock();
                dialogManager.toast("修改密码成功");
                setTimeout(()=>{
                    if(browser.WX){
                        history.go(-1);
                    }else{
                        webBridge.close(4);
                    }
                },600)
            }).catch(res => {
                vm.unLock();
                //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                if(res.msg.indexOf("请先登录") > -1 && !browser.WX){
                    dialogManager.alert("登录超时，请重新登录", {
                        okText:'好的'
                    }).then(function(){
                        storageMessager.send("loginSuc","");
                        webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                    });
                    return;
                }
                dialogManager.toast(res.msg || "请求出错");   
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
            const oldpwd = vm.$refs.oldpwd.value.trim();
            const newpwd = vm.$refs.newpwd.value.trim();
            if(!!oldpwd && !!newpwd) {
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
.m-editpwd-views {
    height:100vh;
    padding: rem(0 70px);        
    .flex{
        @include display-flex(flex);
        @include align-items(center);
        height: rem(100px);        
        .vh-center {
            width: rem(60px);
        }
        input{
            width:100%;
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
        line-height: normal;
    }
    ::-webkit-input-placeholder {
        font-size: rem(32px);
    }
    .button {
        margin-top: rem(50px);
        height: rem(82px);
        @include radius(rem(41px));
        font-size: rem(36px);
        line-height: rem(82px);
        text-align: center;
        @include opacity(50);
        @include transition(all ease-in 400ms);
    }
}
</style>
