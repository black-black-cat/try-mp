<template>
    <div class="m-viprecharge-foot">
        <div>需支付<span>¥</span><span>{{this.money}}</span></div><div class="open" ref="open" @click="open">确认充值</div>
    </div>
</template>
<script>
import { bus, isLock, lock, unLock, get } from 'lib/comp/bus';
import dialog from 'common/plugin/dialog';
import base64 from 'lib/str/base64';
import dialogManager from "common/plugin/dialog";
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    data() {
        return { 
            money: this.options.data.money[1], 
            index: 0 
        }
    },
    created() {
        bus.$on(get("choosed"), (data) => {
            this.money = data;
        })
        bus.$on(get("paytype"), (data) => {
            this.paytype = data;
            this.index++;
        })
        bus.$on(get("password"), (data) => {
            this.password = data;
            this.index++;
        })
    },
    methods: {
        open() {
            let vm = this;
            if(!vm.password) {
                dialog.toast("请输入会员卡密码");
                return;
            }
            if(!vm.paytype) {
                dialog.toast("请选择支付方式");
                return;
            }
            
            if(isLock()) return;
            vm.lock();
            let url = vm.options.href["apiCardrecharge"];
            let divide = url.includes("?") ? "&" : "?"; 
            if(browser.WX){
                vm.$http.get(vm.options.href["apiCardrecharge"], {
                    params: {
                        amount: vm.money,
                        card_id: vm.options.data.cardInfo.id,
                        password: base64.encode(vm.password),
                        card_code: vm.options.data.cardInfo.code,
                        pageUrl: '',
                        open_id: '',
                        bankId: vm.paytype
                    }
                }).then((res) => {
                    vm.unLock(); 
                    window.sessionStorage.setItem("wxpay", res["data"]);
                    let newUrl = url + divide +"amount="+ vm.money + "&card_id="+ vm.options.data.cardInfo.id + "&password="+ base64.encode(vm.password) + "&bankId=" + vm.paytype + "&card_code="+ vm.options.data.cardInfo.code +"&openNew=1";
                    location.assign(newUrl);                    
                                       
                }).catch((res)=> {
                    console.error(res);
                    dialog.toast(res["msg"]);
                    vm.unLock();
                })
            }else{
                let newUrl = url + divide +"amount="+ vm.money + "&card_id="+ vm.options.data.cardInfo.id + "&password="+ base64.encode(vm.password) + "&bankId=WECHAT_PLUGIN&card_code="+ vm.options.data.cardInfo.code;
                this.wxAppPay(newUrl);
            }
        },
        wxAppPay(url){
            let vm = this;
            vm.$http.get(url, {}).then((res) => {                
                let data = JSON.parse(res.data);
                vm.unLock();
                webBridge.launchAppPay(data, rv=>{                    
                    if(rv.code != 0){
                        dialogManager.toast(rv.msg);
                        return;
                    }
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
                dialogManager.toast(res["msg"]);
                console.error(res["msg"]);
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
    watch: {
        index() {
            const vm = this;
            if(!!vm.password && (!!vm.paytype)) {
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

.m-viprecharge-foot{
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
