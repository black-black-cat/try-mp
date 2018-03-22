<template>
    <div class="m-order-content">
        <div class="layout-4">
            <div>购买手机号</div>
            <div class="phone">{{options.orderDetails.mobile}}</div>
        </div>
        <div class="layout-5" :class="backInfor ? 'distanceone': 'distancetwo'">
            <div class="title">选择支付方式</div>
            <template v-if="options.arrPay.card_discounts.length > 0 && options.cinemaCardConf.isSupportBuySnack == 1">
                <template v-for="item in options.arrPay.card_discounts">
                    <div :data-type="item.card_type" data-paytype="MCARD_PREPARED" :data-cardid="item.id" :data-cardno="item.card_no" @click="choose" class="flex">
                        <div>
                            <span class="icon-vip"></span>
                            <span>{{item.cinema_name}}</span>
                            <!-- <span class="rest">(余额：¥{{item.balance}})</span> -->
                        </div>
                        <!-- <template v-if="Number(item.discount_price) <= Number(item.balance)">
                            <div class="check">
                                <i class="icon-hook"></i>
                            </div>
                        </template>
                        <template v-else-if="isSupport('isSupportRecharge')">
                            <div class="recharge open_card">充值</div>
                        </template>
                        <template v-else>
                            <div>余额不足</div>
                        </template> -->

                        <template v-if="isSupport('isSupportRecharge')">
                            <div class="recharge open_card" v-href='options.urlRecharge' :data-query='"&card_id=" + item.id + "&cinema_code=" + options.orderDetails.cinema_code + "&color_code=0"'>充值</div>
                        </template>
                        <div class="check">
                            <i class="icon-hook"></i>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else-if="options.cinemaCardConf.isSupportBuySnack == 1 && isSupport('isSupportRegister')">
                <div data-paytype="OPEN_CARD" @click="openCard">
                    <div>
                        <span class="icon-vip"></span>
                        <span>影城会员卡</span>
                    </div>
                    <div>
                        <!-- <span class="money">¥{{options.lowestCardPrice}}</span>起 -->
                        <span class="open_card">去开卡</span>
                    </div>
                </div>
            </template>
            <template v-for="item in options.arrPay.cinema_pays">
                <template v-if="item.pay_type == 'WECHAT_JS|WXPAY02'">
                    <div @click="choose" :data-paytype="item.pay_type" class="flex">
                        <div>
                            <span class="icon-wx"></span>
                            <span>微信支付</span><span class="rest"></span>
                        </div>
                        <div class="check">
                            <i class="icon-hook"></i>
                        </div>
                    </div>
                </template>
                <template v-if="item.pay_type == 'WECHAT_JS'">
                    <div @click="choose" :data-paytype="item.pay_type" class="flex">
                        <div>
                            <span class="icon-wx"></span>
                            <span>微信支付</span><span class="rest"></span>
                        </div>
                        <div class="check">
                            <i class="icon-hook"></i>
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <div class="layout-6">
            <div>
                <template v-if="backInfor">
                    <div class="tips">
                        <div>
                            <div class="back">
                                <span class="icon-close"></span>特价票不可退改签</div>
                            <div class="change">
                                <span class="icon-hook1"></span>开场前1小时可改签（本月剩余1次）</div>
                        </div>
                        <div class="icon-question"></div>
                    </div>
                </template>
                <div class="pay">
                    <div>
                        <div><span class="waitpay">待支付</span>¥</div>
                        <div class="sum">{{payAmount > 0 ? parseFloat((payAmount).toFixed(2).toString()) : 0}}</div>
                    </div>
                    <!-- <template v-if="options.orderDetails.snack_service_fee > 0">
                        <div class="service">含服务费¥{{options.orderDetails.snack.service_fee}}</div>
                    </template>
                    <template v-else>
                        <div class="service">未包含服务费</div>
                    </template> -->
                    <div class="payOrder" @click="goPay">去支付</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dialogManager from 'common/plugin/dialog';
import closest from 'lib/dom/closest';
import ajax from 'lib/io/ajax';
import popup from 'lib/layer/popup';
import {bus, get, isLock, lock, unLock} from 'lib/comp/bus';
import activity from './Activity';
import paycard from './Card';
import viewport from 'lib/comp/viewport';
import browser from "lib/util/browser";
import webBridge from "common/utils/webBridge";
import base64 from 'lib/str/base64';

let n = 0;
function pushHistory() {
    var state = {title: "title", url: "#"};
    window.history.pushState(state, state.title, state.url);
}
pushHistory();

function onBack (){
    if(browser.gtIOS9 && n == 0){
        n += 1;
        return;
    }
    if(!!window.localStorage.getItem("goneCoupon")) {
        window.localStorage.removeItem("goneCoupon");
        return;
    }

    if (!flag) {
        window.history.back(-1);
        return;
    }
    pushHistory();
    if(!isMealOrderConfrim){
        dialogManager.confirm("返回后你选择的美食将不再保留", {
            okText: '继续支付',
            cancelText: '返回',
            ok() {
                isMealOrderConfrim = false;
                //window.location.reload();
            }
        }).catch(() => {
            isMealOrderConfrim = false;
            if(isLock()) return;
            dialogManager.wait();
            ajax({
                url: options["apiCancel"],
                data: {
                    account: options["orderDetails"]["id"],
                    order_code: options["orderDetails"]["order_code"]
                },
                success: function(res) {
                    unLock();
                    if(localStorage.getItem(`coupon.selectedItems${options.orderDetails.order_code}`)) {
                        localStorage.removeItem(`coupon.selectedItems${options.orderDetails.order_code}`);
                    }
                    dialogManager.closeWait();
                    if(browser.WX){
                        window.history.back(-1);
                    }else{
                        webBridge.close(4);
                    }
                    flag = false;
                },
                error: function(res) {
                    unLock();
                    dialogManager.closeWait();
                    dialogManager.toast(res["msg"]);
                    if(browser.WX){
                        window.history.back(-1);
                    }else{
                        webBridge.close(4);
                    }
                }
            })
        })
    }
    isMealOrderConfrim = true;
}
webBridge.onBackPressed = function () {
    onBack();
    var isIPhone = navigator.appVersion.match(/iphone/gi);
    if (isIPhone) {
        return "turnBackSucceed";
    }
}
let flag = true;
let isMealOrderConfrim = false;
window.addEventListener("popstate", onBack);

if(sessionStorage.getItem("androidback")) {
    sessionStorage.removeItem("androidback");
    !!browser.WX ? location.reload() : webBridge.reload();
}
if(viewport.getDeviceType() === "iphone") {
    window.onpageshow = function(e){
        if(e.persisted) {
            if(browser.WX){
                window.location.reload();
            }else{
                webBridge.reload();
            }
        }
    };
}

export default {
    props: ["options"],
    data() {
        return {
            paytype: '',
            payAmount: this.options.orderDetails.snack_pay_amount,
            snackList: this.options.SnackList,
            cardList: this.options.arrPay.card_discounts,
            food: {},
            cradInfor: {},
            active: '',
            ticketAndCoupon: '',
            backInfor: '',
            cardnum: '',
            cardid: '',
            cinemaCode: '',
            cinemaName: '',
            index: 0,
            hasTouch: true,
            userCashCoupon: false,
            couponInfo: localStorage.getItem(`coupon.selectedItems${this.options.orderDetails.order_code}`) ? JSON.parse(localStorage.getItem(`coupon.selectedItems${this.options.orderDetails.order_code}`))[0] : null,
            cardConfig: this.options.cinemaCardConf || {},
        }
    },
    mounted() {
        const vm = this;
        vm.node = vm.$el.parentNode;
        vm.m_dialog_paycard = popup("<paycard @close='close' @paycard='paycard' :options='options'></paycard>", {
            option: {
                autoHide: true,
                animate: {
                    name: "slide-bottom"
                }
            },
            popup: {
                data() {
                    return {
                        options: {}
                    };
                },
                methods: {
                    close() {
                        vm.m_dialog_paycard.hide();
                    },
                    paycard(data) {
                        vm.params["password"] = base64.encode(data["password"])
                        vm.orderpay();
                    }
                },
                components: {
                    paycard
                }
            }
        });
        vm.m_dialog_paycard.setPosition(0, "auto", "auto", 0);

        let checkList = [].slice.call(document.querySelectorAll(".flex"), 0);
        if (checkList.length > 0) {
            for(var i=0; i< checkList.length; i++) {
                if(!checkList[i].children[checkList[i].children.length-1]) return;
                if(checkList[i].children[checkList[i].children.length-1].classList.contains("check") && vm.index == 0) {
                    checkList[i].children[checkList[i].children.length-1].classList.add("active");
                    vm.paytype = checkList[i].dataset.paytype;
                    vm.cardno = checkList[i].dataset.cardno ? checkList[i].dataset.cardno : '';
                    vm.cardid = checkList[i].dataset.cardid ? checkList[i].dataset.cardid : '';
                    vm.chooseNode = checkList[i].children[checkList[i].children.length-1];
                    vm.chooseNode.setAttribute("data-onlyflag", parseInt(Math.random()*10e6));
                    vm.index++;
                    bus.$emit(get("paytype"), vm.paytype);
                }
            }
        }
    },
    methods: {
        activity() {
            const vm = this;
            vm.m_dialog_activity = popup("<activity :options='options'></activity>", {
                option: {
                    autoHide: true,
                    overlay: {
                        show: true,
                        opacity: 0.5
                    },
                    animate: {
                        name: "slide-bottom"
                    },
                    progressBar: {
                        show: false,
                    }
                },
                popup: {
                    data() {
                        return {
                            options: ''
                        };
                    },
                    components: {
                        activity
                    }
                }
            });
            vm.m_dialog_activity.show(0, "auto", "auto", 0);
        },
        choose(ev) {
            let vm = this;
            let target = closest(ev.target, ".flex", vm.node);

            /*if(target.children[1].innerHTML == "余额不足") {
                return;
            }*/

            vm.paytype = '';
            vm.cardnum = '';
            vm.chooseNode.classList.remove("active");
            target.children[target.children.length - 1].classList.toggle("active");

            if (target.children[target.children.length - 1].classList.contains("active")) {
                vm.paytype = target.dataset.paytype;
                vm.cardno = target.dataset.cardno ? target.dataset.cardno : '';
                vm.cardid = target.dataset.cardid ? target.dataset.cardid : '';
                vm.chooseNode = target.children[target.children.length - 1];
            }

            if(!vm.chooseNode.dataset.onlyflag) {
                vm.chooseNode.setAttribute("data-onlyflag", parseInt(Math.random()*10e6));
            }
            bus.$emit(get("paytype"), vm.paytype);
            vm.index++;
        },
        goPay() {
            let vm = this;
            let num = null;
            if(vm.paytype == '') {
                dialogManager.toast("请选择支付方式");
            }
            if (vm.paytype == "MCARD_PREPARED") {
                vm.params = {
                    amount: vm.payAmount.toFixed(2),
                    bankId: vm.paytype,
                    card_no: vm.cardno,
                    cinemaCode: vm.cinemaCode
                }
                vm.m_dialog_paycard.popup.options = {
                    cardno: vm.cardno,
                    amount: vm.payAmount,
                    cinemaName: vm.cinemaName,
                    ordercode: vm.options.orderDetails.order_code
                }
                vm.m_dialog_paycard.show();
            }
            if(vm.paytype == "WECHAT_JS") {
                var url = vm.options.urlPay+'&amount='+vm.payAmount.toFixed(2)+'&bankId='+ vm.paytype +'';
                if (!vm.hasTouch) return;
                vm.hasTouch = false;
                if(vm.payAmount <= 0) {
                    vm.params = {
                        amount: 0,
                        bankId: vm.paytype,
                        card_no: vm.couponInfo.code,
                        cinemaCode: vm.options.orderDetails.cinema_code,
                        payType: 1,
                        couponPayId: 'THIRDCOUPON'
                    }
                    vm.orderpay();
                    return;
                }
                let couponmsg = vm.userCashCoupon ? '&card_no=' + vm.couponInfo.code + (vm.payAmount > 0 ? '&payType=2': '') + '&couponPayId=THIRDCOUPON' : '';
                !!browser.WX ? location.assign(url+couponmsg) : vm.wxAppPay();
            }
        },
        orderpay() {
            let vm = this;
            if (isLock()) return;
            vm.lock();
            if(!browser.WX && vm.userCashCoupon) vm.params.bankId = "WECHAT_PLUGIN";
            if (vm.paytype == "MCARD_PREPARED" || vm.userCashCoupon) {
                vm.$http.get(vm.options.urlPay, {
                    params: vm.params
                }).then((res) => {
                    vm.unLock();
                    if(browser.WX){
                        location.assign(vm.options.urlSuccess);
                    }else{
                        webBridge.openUrl(vm.options.urlSuccess, "self");
                    }
                }).catch((res) => {
                    vm.unLock();
                    vm.hasTouch = true;
                    dialogManager.toast(res["msg"]);
                    console.error(res["msg"]);
                })
            }
        },
        wxAppPay(){
            let vm = this;
            if (isLock()) return;
            vm.lock();
            let couponmsg = vm.userCashCoupon ? '&card_no=' + vm.couponInfo.code + (vm.payAmount > 0 ? '&payType=2': '') + '&couponPayId=THIRDCOUPON' : '';
            vm.$http.get(vm.options.urlPay + couponmsg, {
                params: {
                    amount: vm.payAmount,
                    bankId: "WECHAT_PLUGIN",
                    cinemaCode: vm.options.orderDetails.cinema_code
                }
            }).then((res) => {
                let data = JSON.parse(res.data.response);
                vm.unLock();
                vm.hasTouch = true;
                webBridge.launchAppPay(data, rv => {
                    if(rv.code != 0){
                        dialogManager.toast(rv.msg);
                        return;
                    }else{
                        dialogManager.alert("支付成功： "+rv.code)
                        webBridge.openUrl(vm.options.urlSuccess, "self");
                    }
                })
            }).catch((res) => {
                vm.unLock();
                dialogManager.toast(res["msg"]);
                console.error(res["msg"]);
            })
        },
        isUseCoupon() {
            const vm = this;
            if(!vm.couponInfo) {
                vm.userCashCoupon = false;
                return;
            }
            if(vm.couponInfo._status != "可使用" || vm.paytype == "MCARD_PREPARED") {
                vm.userCashCoupon = false;
            }
            if(vm.paytype == "WECHAT_JS") {
                if((vm.couponInfo.usetype == "3" || vm.couponInfo.usetype == "2") &&
                 (vm.options.orderDetails.snack_pay_amount >= vm.couponInfo.minprice)) {
                    vm.userCashCoupon = true;
                }
            }
            vm.computePrice();
            bus.$emit(get('userCashCoupon'), vm.userCashCoupon);
        },
        wxPay(val) {
            const vm = this;
            if (isLock()) return;
            vm.lock();
            vm.$http.get(val).then(res => {
                console.log(res);
                vm.unLock();
            }) .catch(res => {
                vm.hasTouch = true;
                vm.unLock();
                let scriptTag = document.createElement("script");
                let str = res.res.match(/javascript">([(\S\s)]*?)<\/script>/)[1];
                scriptTag.innerHTML = str;
                document.body.appendChild(scriptTag);
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', callpay, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', callpay);
                        document.attachEvent('onWeixinJSBridgeReady', callpay);
                    }
                } else {
                    callpay();
                }
            })
        },
        openCard() { //开卡
            if (viewport.getDeviceType() === "iphone") {
                window.localStorage.setItem("goneOpenCard", true);
            }

            !!browser.WX ? location.assign(this.options.urlMemberpolicy) : webBridge.openUrl(this.options.urlMemberpolicy);
        },
        chooseWxPay() { //选择微信
            const vm = this;
            let checkList = [].slice.call(document.querySelectorAll(".flex"), 0);
            if(checkList.length == 0) return;
            let index = 1;
            let actNode = null;
            function wxNode(index) {
                actNode = checkList[checkList.length - index].children[1];
                vm.paytype = checkList[checkList.length - index].dataset.paytype;
            }
            while(vm.paytype != "WECHAT_JS") {
                wxNode(index);
                index++;
            }

            if(!!actNode) {
                actNode.classList.add("active");
                if(!actNode.dataset.onlyflag) {
                    actNode.setAttribute("data-onlyflag", parseInt(Math.random()*10e6));
                }

                if(actNode.dataset.onlyflag != vm.chooseNode.dataset.onlyflag) {
                    vm.chooseNode.classList.remove("active");
                }

                vm.chooseNode = actNode;
                bus.$emit(get("paytype"), vm.paytype);
            }

            vm.isUseCoupon();
        },
        computePrice() {
            let vm = this;
            let orderInfo = vm.options.orderDetails;
            let cash = null;
            let price = 0;
            if(!!vm.couponInfo && vm.userCashCoupon) {
                switch (vm.couponInfo.usetype){
                    case "2":
                        cash = vm.options.orderDetails["snack_pay_amount"] >= vm.couponInfo.price ? vm.couponInfo.price : vm.options.orderDetails["snack_pay_amount"];
                        break;
                    case "3":
                        cash = vm.options.orderDetails["snack_pay_amount"] >= vm.couponInfo.price ? vm.couponInfo.price : vm.options.orderDetails["snack_pay_amount"];
                        break;
                    default:
                        cash: 0;
                }
            }
            for(let index in orderInfo.snacks) {
                price += orderInfo.snacks[index].count * orderInfo.snacks[index]["std_price"];
            }
            bus.$emit(get("price"), price);
            if(vm.paytype == "WECHAT_JS") {
                vm.payAmount = vm.options.orderDetails.snack_pay_amount - cash;

            }
            if(vm.paytype == "MCARD_PREPARED") {
                for (let key in vm.cardList) {
                    if (vm.cardList[key].card_no == vm.cardno && vm.cardList[key].id == vm.cardid) {
                        vm.payAmount = Number(vm.cardList[key].discount_price);
                        vm.cinemaCode = vm.cardList[key]["cinema_code"];
                        vm.cinemaName = vm.cardList[key]["cinema_name"];
                        vm.fee = Number(vm.cardList[key].fee);
                    }
                }
            }
            bus.$emit(get("amount"), vm.payAmount);
        },
        isSupport(prop) {
            const vm = this;
            if (Array.isArray(vm.cardConfig)) {
                return true;
            }
            return +vm.cardConfig[prop];
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
    watch: {
        index: function() {
            let vm = this;
            let orderInfo = vm.options.orderDetails;
            const oldValue = vm.userCashCoupon;
            if (vm.couponInfo && vm.index == 1) {
                vm.chooseWxPay();
                return;
            } else {
                vm.isUseCoupon();
            }

            if (!vm.couponInfo && vm.paytype == "MCARD_PREPARED"  && vm.options.cinemaCardConf["isSupportBuySnack"] == 0) {
                dialogManager.alert('卖品暂不支持卡支付', {
                    okText: '确定',
                    ok() {
                        vm.chooseWxPay();
                    }
                })
                return;
            }

            if(!!vm.couponInfo && vm.paytype == "MCARD_PREPARED" && oldValue && !vm.userCashCoupon) {
                dialogManager.confirm('现金券抵扣不能与影城会员卡支付优惠同时使用，是否继续？', {
                    okText: '用现金券',
                    cancelText: '用会员卡'
                }).then(res => {
                    vm.chooseWxPay();
                    vm.isUseCoupon();
                }).catch(res => {
                    if(vm.options.cinemaCardConf["isSupportBuySnack"] == 0) {
                        dialogManager.alert('卖品暂不支持卡支付', {
                            okText: '确定',
                            ok() {
                                vm.chooseWxPay();
                            }
                        })
                    }
                })
                return;
            }
            vm.computePrice();
        }
    }

}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";

.m-views-order {
    .distanceone {
        padding-bottom: rem(260px);
    }
    .distancetwo {
        padding-bottom: rem(150px);
    }
    .layout-2,
    .layout-4 {
        margin-top: rem(24px);
        padding-left: rem(24px);
        >div {
            font-size: rem(28px);
            line-height: rem(86px);
        }
        >div:first-child {
            border-top: none;
        }
        .ticket {
            @include display-flex(flex);
            @include justify-content(space-between);
            padding-right: rem(24px);
            span {
                font-size: rem(24px);
            }
        }
        .foods {
            @include display-flex(flex);
            @include justify-content(space-between);
            padding-right: rem(24px);
            >div {
                span {
                    margin-left: rem(20px);
                    font-size: rem(24px);
                }
            }
        }
        .coupon,
        .active,
        .total {
            @include display-flex(flex);
            @include justify-content(space-between);
            .action1 {
                @include display-flex(flex);
                @include align-items(center);
                .arrow-right {
                    position: relative;
                    padding-left: rem(35px);
                }
            }
            .action2 {
                .arrow-right {
                    position: relative;
                    padding-left: rem(35px);
                }
            }
        }
        .total {
            padding-right: rem(24px);
        }
    }
    .layout-3 {
        margin-top: rem(24px);
        padding: rem(30px 0 40px 24px);
        .tips {
            @include display-flex(flex);
            @include justify-content(space-between);
            font-size: rem(28px);
        }
        .more {
            .arrow-right {
                position: relative;
                padding-left: rem(35px);
            }
        }
        .meal {
            position: relative;
            @include display-flex(flex);
            margin-top: rem(40px);
        }
        .img {
            @include wh(140px, 140px);
            @include radius(rem(10px));
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .info {
            position: relative;
            margin-top: rem(10px);
            margin-left: rem(20px);
            div:nth-child(1) {
                font-size: rem(28px);
            }
            div:nth-child(2) {
                margin-top: rem(20px);
                font-size: rem(24px);
            }
            div:nth-child(3) {
                position: absolute;
                bottom: rem(8px);
                font-size: rem(30px);
            }
        }
        .sum {
            @include display-flex(flex);
            @include align-items(center);
            position: absolute;
            right: rem(24px);
            top: rem(50px);
        }
        .add,
        .reduce {
            @include wh(40px, 40px);
            font-size: rem(40px);
            font-weight: bold;
            line-height: rem(40px);
            @include radius(100%);
            text-align: center;
        }
        .count {
            font-size: rem(36px);
            line-height: rem(40px);
            padding: rem(0 26px);
        }
    }
    .layout-4 {
        @include display-flex(flex);
        .phone {
            margin-left: rem(20px);
            font-size: rem(28px);
        }
    }
    .layout-5 {
        margin-top: rem(24px);
        padding-left: rem(24px);
        .title {
            font-size: rem(30px);
            line-height: rem(80px);
        }
        >div {
            @include display-flex(flex);
            @include align-items(center);
            @include justify-content(space-between);
            padding-right: rem(24px);
            line-height: rem(100px);
            font-size: rem(28px);
            >div {
                @include display-flex(flex);
                @include align-items(center);
            }
        }
        >div:first-child,
        >div:last-child {
            border-bottom: none;
        }
        .icon-vip,
        .icon-wx {
            margin-right: rem(10px);
        }
        .money {
            font-size: rem(32px);
        }
        .recharge {
            display: inline-block;
        }
        .open_card {
            @include wh(138px, 62px);
            margin-left: rem(10px);
            line-height: rem(62px);
            text-align: center;
            @include radius(rem(31px));
        }
        .rest {
            margin-left: rem(10px);
        }
        .check {
            @include wh(40px, 40px);
            @include radius(100%);
            i {
                margin-left: rem(6px);
            }
        }
        .active {
            border-color: transparent;
        }
    }
    .layout-6 {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: rem(20px 0 0 0);
        >div {
            padding: rem(20px 24px);
        }
        >div>div {
            @include display-flex(flex);
        }
        .tips {
            @include justify-content(space-between);
            font-size: rem(26px);
            padding-bottom: rem(40px);
            >div>div:nth-child(2) {
                margin-top: rem(10px);
            }
            .back {
                @include display-flex(flex);
                @include align-items(center);
                span {
                    margin-right: rem(10px);
                }
            }
            .change {
                @include display-flex(flex);
                @include align-items(center);
                span {
                    margin-right: rem(10px);
                }
            }
            .icon-question {
                margin-top: rem(14px);
            }
        }
        .pay {
            @include display-flex(flex);
            @include justify-content(space-between);
            @include align-items(center);
            font-size: rem(28px);
            >div:nth-child(1) {
                @include display-flex(flex);
            }
            .sum {
                margin-top: rem(-10px);
                font-size: rem(42px);
            }
            .service {
                //margin-left: rem(10px);
            }
            .payOrder {
                @include wh(340px, 90px);
                font-size: rem(38px);
                line-height: rem(90px);
                text-align: center;
                @include radius(rem(45px));
            }
        }
    }
}
</style>
