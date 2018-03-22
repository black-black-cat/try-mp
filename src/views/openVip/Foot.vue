<template>
    <div class="m-openvip-foot">
        <div>需支付<span>¥</span><span>{{this.cardInfor.firstRechargeAmount}}</span><span v-if="this.cardInfor.annualFee > 0">含年费{{this.cardInfor.annualFee}}</span></div><div class="open" @click="open" ref="open">确认开卡</div>
    </div>
</template>
<script>
import { bus, isLock, lock, unLock, get } from 'lib/comp/bus';
import dialog from 'common/plugin/dialog';
import base64 from 'lib/str/base64';
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"

export default {
    props: ["options"],
    data() {
        return {
            payInfor: {
                deal: true,
                nick: this.options.data.user.nick
            },
            paytype: '',
            code: null,
            pwdone: null,
            pwdtwo: null,
            index: 0,
            cardInfor: this.options.data.cardInfo,
        }
    },
    methods: {
        open: function() {
            let vm = this;
            if(!vm.code) {
                dialog.toast("请输入验证码");
                return;
            }
            if(!vm.pwdone) {
                dialog.toast("请输入六位以上数字密码");
                return;
            }
            if(vm.pwdone != vm.pwdtwo)  {
                dialog.toast("两次输入密码不一致，请重新输入");
                return;
            }

            if(!vm.payInfor.deal) {
                dialog.toast("请阅读并同意会员卡协议");
                return;
            }
            if(!vm.paytype) {
                dialog.toast("请选择支付方式");
                return;
            }
            if(isLock()) return;
            vm.lock();
            if(browser.WX){
                vm.$http.get(vm.options.href.apiCreate, {
                    params: {
                        nick: vm.payInfor.nick,
                        cinema_code: vm.cardInfor.cinemaCode,
                        policyId: vm.cardInfor.policyId,
                        sms_code: vm.code,
                        password: base64.encode(vm.pwdone),
                        bankId: vm.paytype
                    }
                }).then((res)=> {
                    window.sessionStorage.setItem("wxpay", res["data"]);
                    if(vm.paytype == "WECHAT_JS") {
    					let link = vm.options.href.apiCreate;
                        let divide = link.includes("?") ? "&" : "?";
                        let url = link + divide + 'nick='+ vm.payInfor.nick + '&cinema_code='+ vm.cardInfor.cinemaCode + '&policyId=' + vm.cardInfor.policyId + '&sms_code=' + vm.code + '&password='+ base64.encode(vm.pwdone) + '&bankId='+ vm.paytype +"&openNew=1";
                            location.assign(url);
                    }
                }).catch((res)=> {
                    vm.unLock();
                    //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                    if(res.msg.indexOf("请先登录") > -1 && !browser.WX){
                        dialog.alert("登录超时，请重新登录", {
                            okText:'好的'
                        }).then(function(){
                            storageMessager.send("loginSuc","");
                            webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                        });
                        return;
                    }
                    dialog.toast(res.msg || "请求出错"); 
                })
            }else{
                let link = vm.options.href.apiCreate;
                let divide = link.includes("?") ? "&" : "?";
                let url = link + divide + 'nick='+ vm.payInfor.nick + '&cinema_code='+ vm.cardInfor.cinemaCode + '&policyId=' + vm.cardInfor.policyId + '&sms_code=' + vm.code + '&password='+ base64.encode(vm.pwdone) + '&bankId=WECHAT_PLUGIN';
                vm.wxAppPay(url);
            }
        },
        wxAppPay(url){
            let vm = this;
            vm.lock();  
            vm.$http.get(url).then((res) => {                        
                let data = JSON.parse(res.data);   
                vm.unLock();             
                webBridge.launchAppPay(data, rv=>{
                    if(rv.code != 0){
                        dialog.toast(rv.msg);
                        return;
                    }
                    storageMessager.send("openVip",true);
                    vm.lock();
                    vm.$http.get(vm.options.href.apiRechargeList, {
                        params: {
                            page_no: 1,
                            page_size: 1
                        }
                    }).then((rs)=>{
                        vm.unLock();
                        if(rs.code != 0){
                            webBridge.openUrl(vm.options.href.urlMyorder, "self");
                        }else{                            
                            let orderCode = rs.data.list[0].order_code;
                            webBridge.openUrl(vm.options.href.urlSuccess + orderCode, "self");
                        }
                    }).catch((er)=>{
                        vm.unLock();
                        webBridge.openUrl(vm.options.href.urlMyorder, "self");
                    })
                }) 
            }).catch((res) => {
                vm.unLock();
                //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                if(res.msg.indexOf("请先登录") > -1 && !browser.WX){
                    dialog.alert("登录超时，请重新登录", {
                        okText:'好的'
                    }).then(function(){
                        storageMessager.send("loginSuc","");
                        webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                    });
                    return;
                }
                dialog.toast(res.msg || "请求出错");                 
            })
        },
        lock() {
            lock();
            dialog.wait();
        },
        unLock() {
            unLock();
            dialog.closeWait();
        }
    },
    created() {
        const vm = this;
        bus.$on(get("payInfo"), (data) => {
            vm.payInfor = data;
            vm.index++;
        })
        bus.$on(get("paytype"), (data) => {
            vm.paytype = data.paytype;
            vm.index++;
        })
        bus.$on(get("pwdone"), (data) => {
            vm.pwdone = data;
            vm.index++;
        })
        bus.$on(get("pwdtwo"), (data) => {
            vm.pwdtwo = data;
            vm.index++;
        })
        bus.$on(get("getcode"), (data) => {
            vm.code = data;
            vm.index++;
        })
    },
    watch: {
        index: function() {
            let vm = this;
            if((!!vm.payInfor) && (!!vm.paytype) && (!!vm.pwdone) && (!!vm.pwdtwo)) {
                vm.$refs.open.style.opacity = '1';
            } else {
                vm.$refs.open.style.opacity = '0.5';
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";

.m-openvip-foot{
    @include display-flex(flex);
    @include align-items(center);
    @include justify-content(space-between);
    height: rem(130px);
    margin-top: rem(24px);
    padding: rem(0 24px);
    font-size: rem(28px);
    span {
        font-weight: bold;
        &:nth-child(1) {
            margin: rem(0 4px 0 14px);
        }
        &:nth-child(2) {
            font-size: rem(42px);
        }
        &:nth-child(3) {
            margin-left: rem(14px);
            font-size: rem(22px);
        }
    }
    .open {
        @include wh(338px, 90px);
        font-size: rem(36px);
        line-height: rem(90px);
        text-align: center;
        @include radius(rem(45px));
        @include opacity(50);
    }

}
</style>
