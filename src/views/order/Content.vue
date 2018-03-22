<template>
    <div class="m-order-content">
        <div class="layout-2">
            <div class="ticket">
                <div>影票
                    <span>(¥{{options.orderDetails.salePrice}}x{{options.orderDetails.ticket_count}})</span>
                </div>
                <div>¥{{parseFloat((options.orderDetails.salePrice*options.orderDetails.ticket_count).toFixed(2).toString())}}</div>
            </div>
            <template v-if="chooseSnack.length > 0">
                <div class="foods" v-for="item in chooseSnack">
                    <div>{{item.name}}
                        <span>(¥{{item.net_price}}x{{item.count}})</span>
                    </div>
                    <div>¥{{parseFloat((item.net_price*item.count).toFixed(2).toString())}}</div>
                </div>
            </template>
            <template v-if="ticketAndCoupon && !options.orderDetails.activity_code">
                <div class="coupon" @click="goCoupon">
                    <div>电子券和优惠券</div>
                    <div class="action1">
                        <template v-if="userCashCoupon">
                            已选¥{{this.couponInfo.price}}{{this.couponInfo.type}}
                        </template>
                        <template v-else>
                            选择优惠券
                        </template>
                        <i class="arrow-right"></i>
                    </div>
                </div>
            </template>
            <template v-if="options.orderDetails.activity_code">
                <div class="active" @click="activity">
                    <div>活动优惠</div>
                    <div class="action2">{{options.orderDetails.activity_name}}
                        <!-- <i class="arrow-right"></i> -->
                    </div>
                </div>
            </template>
            <template v-if="reduce > 0">
                <div class="reduce">
                    <div>优惠金额</div>
                    <div class="action4">-¥{{parseFloat((reduce).toFixed(2).toString())}}</div>
                </div>
            </template>
            <div class="total">
                <div>小计</div>
                <div class="action3">¥{{payAmount > 0 ? parseFloat((payAmount).toFixed(2).toString()) : 0}}</div>
            </div>
        </div>
        <template v-if="!!snackList[0] && !options.orderDetails.activity_code">
            <div class="layout-3">
                <div class="tips">
                    <div>据说爆米花和电影更配哟</div>
                    <div class="more" @click="meals">更多
                        <i class="arrow-right"></i>
                    </div>
                </div>
                <div class="meal">
                    <div class="img">
                        <lazy-image :src="snackList[0].image" init-src="/images/common/meal-default.jpg"/>
                    </div>
                    <div class="info">
                        <div>{{snackList[0].name}}</div>
                        <div>{{snackList[0].remark}}</div>
                        <div>¥{{snackList[0].net_price}}<span class="std-price">门市价<span>¥{{snackList[0].std_price}}</span></span></div>
                    </div>
                    <div class="sum" :data-code="snackList[0].code">
                        <div class="reduce" v-if="snackList[0].count > 0" @click="count"></div>
                        <div class="count" v-if="snackList[0].count > 0">{{snackList[0].count}}</div>
                        <div class="add" @click="count"></div>
                    </div>
                </div>
            </div>
        </template>
        <div class="layout-4">
            <div>购票手机号</div>
            <div class="phone">{{options.orderDetails.mobile}}</div>
        </div>
        <div class="layout-5" :class="backInfor ? 'distanceone': 'distancetwo'">
            <div class="title">选择支付方式</div>
            <template v-if="(options.arrPay.card_discounts.length) > 0 && isSupportMCard">
                <template v-for="item in options.arrPay.card_discounts">
                    <div v-if="(bindOrder && isSupport('isSupportBuySnack')) || !bindOrder" :data-type="item.card_type" data-paytype="MCARD_PREPARED" :data-cardid="item.id" :data-cardno="item.card_no" @click="choose" class="flex" >
                        <div>
                            <span class="icon-vip"></span>
                            <span>{{item.cinema_name}}</span>
                            <!-- <span class="rest">(余额：¥{{item.balance}})</span> -->
                        </div>
                        <template v-if="isSupport('isSupportRecharge')">
                            <div class="recharge open_card" v-href='options.urlRecharge' :data-query='"&card_id=" + item.id + "&cinema_code=" + options.orderDetails.cinema_code + "&color_code=0"'>充值</div>
                        </template>
                        <div class="check">
                            <i class="icon-hook"></i>
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
                        
                    </div>
                </template>
            </template>
            <template v-else-if="(options.arrPay.card_discounts.length == 0) && isSupport('isSupportRegister') && (options.lowestCardPrice > 0) && isSupportMCard">
                <div data-paytype="OPEN_CARD" @click="openCard">
                    <div>
                        <span class="icon-vip"></span>
                        <span>影城会员卡</span>
                    </div>
                    <div>
                        <span class="money">¥{{options.lowestCardPrice}}</span>起
                        <span class="open_card">去开卡</span>
                    </div>
                </div>
            </template>
            <template v-for="item in options.arrPay.cinema_pays">
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
                    <div><span class="waitpay">待支付</span>¥</div>
                    <div class="sum">{{payAmount > 0 ? parseFloat((payAmount).toFixed(2).toString()) : 0}}</div>
                    <template v-if="this.fee > 0">
                        <div class="service">含服务费¥{{parseFloat((this.fee).toFixed(2).toString())}}</div>
                    </template>
                    <template v-else>
                        <div class="service">含服务费¥0</div>
                    </template>
                    <div class="payOrder" @click="goPay" ref="goPay">去支付</div>
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
import { bus, isLock, lock, unLock, get } from 'lib/comp/bus';
import activity from './Activity';
import paycard from './Card';
import meals from './Meals';
import base64 from 'lib/str/base64';
import viewport from 'lib/comp/viewport';
import browser from "lib/util/browser";
import webBridge from "common/utils/webBridge";


let n = 0;
function pushHistory() {
    var state = {title: "title", url: "#"};
    window.history.pushState(state, state.title, state.url);
}
function onBack (ev) {  //popstate监听返回按钮
    if(browser.gtIOS9 && n == 0){
        n += 1;
        return;

    }
    if(!!window.localStorage.getItem("goneOpenCard")) {
        window.localStorage.removeItem("goneOpenCard");
        return;
    }
    if (!flag) {
        !!browser.WX ? window.history.go(-1) : webBridge.close();
        return;
    }
    pushHistory();
    if(!isOrderConfirm){//避免确认框反复弹出
        dialogManager.confirm("返回后你当前的座位将不再保留", {
            okText: '继续支付',
            cancelText: '返回',
            ok() {
                isOrderConfirm = false;
            }
        }).catch(() => {
            isOrderConfirm = false;
            if (isLock()) return;
            dialogManager.wait();
            ajax({
                url: options["apiCancel"],
                data: {
                    account: options["orderDetails"]["id"],
                    order_code: options["orderDetails"]["order_code"]
                },
                success: function(res) {
                    unLock();
                    dialogManager.closeWait();

                    if(window.localStorage.getItem(`coupon.selectedItems${options.orderDetails.order_code}`)) {
                        window.localStorage.removeItem(`coupon.selectedItems${options.orderDetails.order_code}`);
                    }

                    if(window.localStorage.getItem(`mealList${options.orderDetails.order_code}`)) {
                        window.localStorage.removeItem(`mealList${options.orderDetails.order_code}`);
                    }

                    flag = false;
                    !!browser.WX ? window.history.go(-1) : webBridge.close(4);
                },
                error: function(res) {
                    unLock();
                    dialogManager.closeWait();
                    !!browser.WX ? window.history.go(-1) : webBridge.close(4);
                }
            })
        })
    }
    isOrderConfirm = true;
}
webBridge.onBackPressed = function () {
    onBack();
    var isIPhone = navigator.appVersion.match(/iphone/gi);
    if (isIPhone) {
        return "turnBackSucceed";
    }
}
pushHistory();
let flag = true;
let isOrderConfirm = false;
window.addEventListener("popstate", onBack);


if(sessionStorage.getItem("androidback")) {
    sessionStorage.removeItem("androidback");
    !!browser.WX ? location.reload() : webBridge.reload();
}

if(viewport.getDeviceType() === "iphone") {
    window.onpageshow = function(e){
        !!e.persisted ? !!browser.WX ? window.location.reload() : webBridge.reload() : null;
    };
}

export default {
    props: ["options"],
    data() {
        const vm = this;
        return {
            paytype: '',
            payAmount: this.options.orderDetails.pay_amount,
            snackList: this.options.SnackList,
            cardList: this.options.arrPay.card_discounts,
            cradInfor: {},
            active: '',
            ticketAndCoupon: this.options.urlCoupon || '',
            backInfor: '',
            cardno: '',
            cardid: '',
            cinemaCode: '',
            cinemaName: '',
            index: 0,
            snackArr: [],
            snackLock: false,
            pageUrl: '',
            params: {},
            fee: options.orderDetails.service_fee,
            reduce: 0,
            chooseNode: null,
            chooseSnack: [],
            hasTouch: true,
            mealPrice: 0,
            bindOrder: false,
            userCashCoupon: false,
            couponInfo: localStorage.getItem(`coupon.selectedItems${this.options.orderDetails.order_code}`) ? JSON.parse(localStorage.getItem(`coupon.selectedItems${this.options.orderDetails.order_code}`))[0] : null,
            cardConfig: this.options.cinemaCardConf || {},
            noSubmit: true,
            appBind: false,
            // isSupportMCard: !this.options.orderDetails.activity_code || (this.options.orderDetails.activity_code && this.options.arrPay.supportMcard),
            isSupportMCard: (function () {
                switch (+vm.options.orderDetails.activity_type) {
                    case 0:
                        return vm.options.arrPay.supportMcard;
                    break;
                    case 1:
                        return false;
                    break;
                }
                return vm.options.arrPay.supportMcard;
            }())
        }
    },
    beforeMount() {
        const vm = this;
        for (let item in vm.snackList) {
            vm.mealPrice += vm.snackList[item].count * vm.snackList[item]["net_price"];
            if (vm.snackList[item].count > 0) {
                vm.snackArr.push(vm.snackList[item].code + ':' + vm.snackList[item].count);
                vm.chooseSnack.push(vm.snackList[item]);
            }
        }
        for (let key in vm.options.arrPay["cinema_pays"]) {
            if(vm.options.arrPay["cinema_pays"][key]["pay_type"] == 'WECHAT_JS') {
                vm.options.orderDetails.ticket_pay_amount = vm.options.arrPay["cinema_pays"][key]["ticket_price"];
            }
        }
        if (vm.chooseSnack.length > 0) {
            vm.bindOrder = true;
            vm.appBind = true;
        }
    },
    mounted() {
        const vm = this;
        const statusArr = ["待支付", "已取消", "已过期", "支付成功", "支付失败", "退款成功", "退款失败"];
        vm.node = vm.$el.parentNode;
        if (vm.options.orderDetails.order_status != 1) {
            dialogManager.toast("订单" + statusArr[vm.options.orderDetails.order_status - 1]);
            setTimeout(function() {
                // !!browser.WX ? window.history.go(1-window.history.length) : webBridge.close(4);
                !!browser.WX ? location.assign(vm.options.urlIndex) : webBridge.close(4);
            }, 1000);
        }
        vm.m_dialog_meal = popup("<meals @close='close' :options='options' :cost='cost' :price='price'></meals>", {
            option: {
                // autoHide: true,
                animate: {
                    name: "slide-bottom"
                }
            },
            popup: {
                data() {
                    return {
                        options: {},
                        cost: {
                            fee: vm.options.orderDetails.service_fee,
                            amount: vm.payAmount
                        },
                        price:null
                    };
                },
                methods: {
                    close() {
                        vm.m_dialog_meal.hide();
                    }
                },
                components: {
                    meals
                }
            }
        });
        vm.m_dialog_meal.setPosition(0, "auto", "auto", 0);

        vm.m_dialog_activity = popup("<activity @close='close' :options='options'></activity>", {
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
                components: {
                    activity
                },
                methods: {
                    close() {
                        vm.m_dialog_activity.hide();
                    }
                }
            }
        });
        vm.m_dialog_activity.setPosition(0, "auto", "auto", 0);

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
                        //vm.payAmount = vm.options.orderDetails.pay_amount;
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
                }
            }
        }
        this.$nextTick(function() {
            console.log(this.options);
        })
    },
    methods: {
        activity() { //活动
            const vm = this;
            vm.m_dialog_activity.popup.options = vm.options.orderDetails;
            //vm.m_dialog_activity.show();
        },
        meals() { //卖品
            const vm = this;
            if(vm.bindOrder) {
                dialogManager.toast("当前订单已锁定，请重新选座");
                return;
            }
            /*
            是否用优惠券
            抵扣影票价格还是卖品价格
            优惠券信息{
                最低消费
                总金额
            }
            影票价格
            */
            let orderInfo = vm.options.orderDetails;
            vm.m_dialog_meal.popup.price = null;
            if( vm.couponInfo && vm.couponInfo.usetype != 1 && (vm.couponInfo.usetype == 3 && vm.couponInfo.minprice > orderInfo.ticket_pay_amount) && vm.couponInfo._status === "可使用" && vm.paytype != "MCARD_PREPARED"){
                vm.m_dialog_meal.popup.price = {
                    couponInfo: vm.couponInfo,
                    ticket_price: orderInfo.ticket_pay_amount
                }
            }
            vm.m_dialog_meal.popup.options = vm.snackList;
            vm.m_dialog_meal.popup.cost = { fee: vm.fee, amount: vm.payAmount };
            vm.m_dialog_meal.show();
            bus.$emit(get("mealList"), vm.snackList);
        },
        count(ev) { //卖品数统计
            let vm = this;
            let num = 0;
            if(vm.bindOrder) {
                dialogManager.toast("当前订单已锁定，请重新选座");
                return;
            }

            for (let item in vm.snackList) {
                num += vm.snackList[item]["count"];
            }

            if (ev.target.classList.contains("add")) {
                if (num < 4) {
                    vm.snackList[0]["count"]++;
                } else {
                    dialogManager.toast("卖品最多选择4个，请重新选择");
                    return;
                }
            }

            if (ev.target.classList.contains("reduce")) {
                vm.snackList[0]["count"]--;
            }

            vm.index++;
        },
        choose(ev) { //支付方式选择
            let vm = this;
            let target = closest(ev.target, ".flex", vm.node);

            // if (target.children[1].innerHTML == "余额不足") return;
            /*if (target.children[1].classList.contains("recharge")) {
                let url = `${vm.options.urlRecharge}&card_id=${target.dataset.cardid}&cinema_code=${vm.options.orderDetails.cinema_code}&color_code=0`;
                !!browser.WX ? location.assign(url) : webBridge.openUrl(url);
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

            vm.index++;
        },
        goPay() { //去支付
            let vm = this;
            let num = null;
            let hasTouch = true;
            if (!!vm.payFlag) return;
            if (!vm.paytype) {
                dialogManager.toast("请选择支付方式");
                return;
            }
            let couponmsg = vm.userCashCoupon ? '&card_no=' + vm.couponInfo.code + (vm.payAmount > 0 ? '&payType=2': '') + '&couponPayId=THIRDCOUPON' : '';
            vm.pageUrl = vm.options.urlPay + '&amount=' + vm.payAmount.toFixed(2) + '&bankId=' + vm.paytype + couponmsg;

            if(vm.paytype == "MCARD_PREPARED") {
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
            }

            if(!vm.bindOrder && vm.snackArr.length > 0 && vm.noSubmit) {
                vm.checkmeal();
                return;
            } else if (vm.paytype == "MCARD_PREPARED") {
                vm.m_dialog_paycard.show();
            } else if (vm.paytype == "WECHAT_JS") {
                if (!vm.hasTouch) return;
                vm.hasTouch = false;
                if(vm.payAmount <= 0) {
                    vm.params = {
                        amount: vm.payAmount.toFixed(2),
                        bankId: vm.paytype,
                        card_no: vm.couponInfo.code,
                        cinemaCode: vm.options.orderDetails.cinema_code,
                        payType: 1,
                        couponPayId: 'THIRDCOUPON'
                    }
                    vm.orderpay();
                    return;
                }
                !!browser.WX ? location.assign(vm.pageUrl) : vm.wxAppPay();
            }
        },
        checkmeal() { //混合订单，卖品验证
            const vm = this;
            if (isLock()) return;
            vm.lock();
            vm.$http.get(vm.options["urlLocksnack"], {
                params: {
                    order_code: vm.options.orderDetails.order_code,
                    cinema_code: vm.options.orderDetails.cinema_code,
                    snacks: vm.snackArr.join(","),
                }
            }).then((res) => {
                vm.unLock();
                vm.noSubmit = false;
                if(vm.paytype == "WECHAT_JS") {
                    !!browser.WX ? location.assign(vm.pageUrl) : vm.wxAppPay();
                }

                if(vm.paytype == "MCARD_PREPARED") {
                    vm.m_dialog_paycard.show();
                }
            }).catch((res) => {
                vm.unLock();
                dialogManager.toast(res["msg"]);
            })
        },
        wxPay() { //微信支付
            const vm = this;
            if (isLock()) return;
            vm.lock();
            vm.$http.get(vm.pageUrl).then(res => {
                console.log(res);
                vm.unLock();
            }) .catch(res => {
                vm.hasTouch = false;
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
        wxAppPay(){
            let vm = this;
            if (isLock()) return;
            vm.lock();
            let couponmsg = vm.userCashCoupon ? '&card_no=' + vm.couponInfo.code + (vm.payAmount > 0 ? '&payType=2': '') + '&couponPayId=THIRDCOUPON' : '';
            vm.$http.get(vm.options.urlPay + couponmsg, {
                params: {
                    amount: vm.payAmount.toFixed(2),
                    bankId: "WECHAT_PLUGIN",
                    cinemaCode: vm.options.orderDetails.cinema_code
                }
            }).then((res) => {
                let data = JSON.parse(res.data.response);
                vm.bindOrder = true;
                vm.unLock();
                vm.hasTouch = true;
                webBridge.launchAppPay(data, function(rv){
                    if(rv.code != 0){
                        vm.payFlag = false;
                        dialogManager.toast(rv.msg);
                        return;
                    }else{
                        dialogManager.toast("支付成功")
                        webBridge.openUrl(vm.options.urlSuccess, "self");
                    }
                })
            }).catch((res) => {
                vm.unLock();
                dialogManager.toast(res["msg"]);
            })
        },
        orderpay() { //会员卡支付
            let vm = this;
            if (isLock()) return;
            vm.lock();
            if(!browser.WX && vm.userCashCoupon) vm.params.bankId = "WECHAT_PLUGIN";
            if (vm.paytype == "MCARD_PREPARED" || vm.userCashCoupon) {
                vm.$http.get(vm.options.urlPay, {
                    params: vm.params
                }).then((res) => {
                    vm.unLock();
                    vm.m_dialog_paycard.hide();
                    !!browser.WX ? location.assign(vm.options.urlSuccess) : webBridge.openUrl(vm.options.urlSuccess, "self");
                }).catch((res) => {
                    vm.unLock();
                    vm.hasTouch = true;
                    dialogManager.toast(res["msg"]);
                })
            }
        },
        chooseWxPay() { //选择微信
            const vm = this;
            let checkList = [].slice.call(document.querySelectorAll(".flex"), 0);
            if(checkList.length == 0) return;
            let index = 1;
            let actNode = null;

            function wxNode(index) {
                console.log(checkList[checkList.length - index]);
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
            }
            vm.isUseCoupon();
        },
        isUseCoupon() { //优惠券是否可用
            const vm = this;
            if(!vm.couponInfo) {
                vm.userCashCoupon = false;
                vm.computePrice();
                return;
            }
            if(vm.couponInfo._status != "可使用" || vm.paytype == "MCARD_PREPARED") {
                vm.userCashCoupon = false;
            }

            if(vm.paytype == "WECHAT_JS") {
                if((vm.couponInfo.usetype == "3" || vm.couponInfo.usetype == "1")
                    && (vm.options.orderDetails.ticket_pay_amount >= vm.couponInfo.minprice)) {
                    vm.userCashCoupon = true;
                } else if((vm.couponInfo.usetype == "2" || vm.couponInfo.usetype == "3") &&
                     (vm.couponInfo.minprice <= vm.mealPrice)) {
                    vm.userCashCoupon = true;
                } else {
                    vm.userCashCoupon = false;
                }
            }
            vm.computePrice();
        },
        computePrice() { //计算价格
            let vm = this;
            let orderInfo = vm.options.orderDetails;
            let cash = null;
            let payAmount = vm.bindOrder ? orderInfo.ticket_pay_amount - vm.mealPrice : orderInfo.ticket_pay_amount;
            if(!!vm.couponInfo && vm.userCashCoupon) {
                switch (vm.couponInfo.usetype){
                    case "1":
                        cash = payAmount >= vm.couponInfo.price ? vm.couponInfo.price : payAmount;
                        break;
                    case "2":
                        cash = vm.mealPrice >= vm.couponInfo.price ? vm.couponInfo.price : vm.mealPrice;
                        break;
                    case "3":
                        if(payAmount >= vm.couponInfo.minprice) {
                            cash = payAmount >= vm.couponInfo.price ? vm.couponInfo.price : payAmount;
                        } else if(vm.mealPrice >= vm.couponInfo.minprice) {
                            cash = vm.mealPrice >= vm.couponInfo.price ? vm.couponInfo.price : vm.mealPrice;
                        }
                        break;
                    default:
                        cash: 0;
                }
            }
            if (vm.paytype == "WECHAT_JS") {
                vm.payAmount = Number(orderInfo.ticket_pay_amount) + Number(vm.bindOrder && vm.appBind ? 0 : vm.mealPrice) - Number(cash);
                vm.reduce = Number(orderInfo.salePrice) * Number(orderInfo.ticket_count) - Number(payAmount) + Number(cash);
                vm.fee = orderInfo.service_fee;
                if(!!vm.payFlag) {
                    vm.$refs.goPay.style.opacity = '1';
                    vm.payFlag = false;
                }
            }

            if (vm.paytype == "MCARD_PREPARED") {
                for (let key in vm.cardList) {
                    if (vm.cardList[key].card_no == vm.cardno && vm.cardList[key].id == vm.cardid) {
                        vm.payAmount = Number(vm.cardList[key].discount_price) + (vm.bindOrder && vm.appBind? 0 : vm.mealPrice);
                        vm.reduce = Number(orderInfo.salePrice) * Number(orderInfo.ticket_count) - Number(vm.cardList[key].discount_price);
                        vm.cinemaCode = vm.cardList[key]["cinema_code"];
                        vm.cinemaName = vm.cardList[key]["cinema_name"];
                        vm.fee = Number(vm.cardList[key].fee);
                        if(false/* vm.payAmount > vm.cardList[key]["balance"] */) {
                            dialogManager.toast("你的余额已不足，请重新选择");
                            vm.$refs.goPay.style.opacity = '0.5';
                            vm.payFlag = true;
                        } else {
                            vm.$refs.goPay.style.opacity = '1';
                            vm.payFlag = false;
                        }
                    }
                }

                if(vm.userCashCoupon) {
                    let payMoney = Number(orderInfo.ticket_pay_amount) - Number(cash);
                    let reduceMoney = Number(orderInfo.salePrice) * Number(orderInfo.ticket_count) - Number(orderInfo.ticket_pay_amount) + Number(cash);
                    if(payMoney > vm.payAmount) {
                        dialogManager.confirm('直接使用会员卡会比用优惠券更实惠哦，确定要使用优惠券吗？', {
                            okText: '确定',
                            cancelText: '取消'
                        }).then(res => {
                            vm.payAmount = payMoney;
                            vm.reduce = reduceMoney;
                        }).catch(res => {
                            vm.userCashCoupon = false;
                        })
                    }
                }
            }
        },
        comparePrice() { //比价
            const vm = this.options;
            var payWays = new Array();
            Object.keys(vm.arrPay).forEach( name => {
                payWays = payWays.concat(vm.arrPay[name]);
            })
            var quickSort = function(arr) {
            　　if (arr.length <= 1) { return arr; }
            　　var pivotIndex = Math.floor(arr.length / 2);
            　　var pivot = arr.splice(pivotIndex, 1)[0];
            　　var left = [];
            　　var right = [];
            　　for (var i = 0; i < arr.length; i++){
            　　　　if (arr[i]["ticket_price"] < pivot["ticket_price"]) {
            　　　　　　left.push(arr[i]);
            　　　　} else {
            　　　　　　right.push(arr[i]);
            　　　　}
            　　}
            　　return quickSort(left).concat([pivot], quickSort(right));
            };

            function toArray(list, start) {
                start = start || 0;
                var i = list.length - start;
                var ret = new Array(i);
                while (i--) {
                    ret[i] = list[i + start];
                }
                return ret
            }
            let minPayWay = quickSort(payWays)[0];
            let nodeList = toArray(document.querySelectorAll(".flex"));
            let minNode = null;
            if(nodeList.length == 1) return;
            for(let index in nodeList) {
                if(!!minPayWay["card_no"]) {
                    if(minPayWay["card_no"] == nodeList[index].dataset.cardno && minPayWay["id"] == nodeList[index].dataset.cardid) {
                        minNode = nodeList[index];
                    }
                } else {
                    if(nodeList[index].dataset.paytype == minPayWay["pay_type"]) {
                        minNode = nodeList[index];
                    }
                }
            }
            if(!!minNode) {
                if(vm.chooseNode) {
                    vm.chooseNode.classList.remove("active");
                }
                if(minNode.children[minNode.children.length-1].classList.contains("check")) {
                    minNode.children[minNode.children.length-1].classList.add("active");
                    vm.paytype = minNode.dataset.paytype;
                    vm.cardno = minNode.dataset.cardno ? minNode.dataset.cardno : '';
                    vm.cardid = minNode.dataset.cardid ? minNode.dataset.cardid : '';
                    vm.chooseNode = minNode.children[minNode.children.length-1];
                    vm.chooseNode.setAttribute("data-onlyflag", parseInt(Math.random()*10e6));
                    vm.index++;
                }
            }
        },
        goCoupon() { //优惠券
            const vm = this;
            let orderInfo = vm.options.orderDetails;
            let pricesell = vm.mealPrice > 0 ? '&pricesell='+ vm.mealPrice : '';
            let couponurl = vm.ticketAndCoupon+'&film_code='+ orderInfo.film_code + '&priceticket='+ orderInfo.ticket_pay_amount + pricesell +'&ordercode='+ orderInfo.order_code;
            if (viewport.getDeviceType() === "iphone") {
                window.localStorage.setItem("goneOpenCard", true);
            }
            // if(vm.bindOrder) {
            //     dialogManager.toast("当前订单已锁定，请重新选座");
            //     return;
            // }
            if(!!pricesell) {
                vm.saveMealInfo();
            }

            function couponPage() {
                !!browser.WX ? location.assign(couponurl) : webBridge.openUrl(couponurl);
            }

            if(vm.paytype == "MCARD_PREPARED") {
                dialogManager.confirm('现金券抵扣不能与影城会员卡支付优惠同时使用，是否继续？', {
                    okText: '用现金券',
                    cancelText: '用会员卡'
                }).then(res => {
                    couponPage();
                }).catch(res => {
                    vm.cancelMealInfo();
                })
                return;
            }
            if(vm.paytype == "WECHAT_JS") {
                couponPage();
            }
        },
        getMealPrice(){
            let vm = this;
            vm.mealPrice = 0;
            for (let item in vm.snackList) {
                vm.mealPrice += vm.snackList[item].count * vm.snackList[item]["net_price"];
                if (vm.snackList[item].count > 0) {
                    vm.snackArr.push(vm.snackList[item].code + ':' + vm.snackList[item].count);
                    vm.chooseSnack.push(vm.snackList[item]);
                }
            }
            //console.log(vm.chooseSnack);
        },
        openCard() { //开卡
            if (viewport.getDeviceType() === "iphone") {
                window.localStorage.setItem("goneOpenCard", true);
            }
            !!browser.WX ? location.assign(this.options.urlMemberpolicy) : webBridge.openUrl(this.options.urlMemberpolicy);
        },
        saveMealInfo() {
            const vm = this;
            let jsonStr = JSON.stringify(vm.snackList);
            localStorage.setItem(`mealList${vm.options.orderDetails.order_code}`, jsonStr);
        },
        cancelMealInfo() {
            localStorage.removeItem(`mealList${this.options.orderDetails.order_code}`);
        },
        unSupportCardBySnack () {
            const vm = this;
            dialogManager.confirm('卖品暂不支持卡支付', {
                okText: '确定',
                cancelText: '取消',
                ok() {
                    vm.chooseWxPay();
                }
            }).catch(() => {
                for (let item in vm.snackList) {
                    vm.snackList[item].count = 0;
                }
                vm.mealPrice = 0;
                vm.snackArr = [];
                vm.chooseSnack = [];
                vm.computePrice();
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
        isSupport(prop) {
            const vm = this;
            if (Array.isArray(vm.cardConfig)) {
                return true;
            }
            return +vm.cardConfig[prop];
        }
    },
    created() {
        let vm = this;
        bus.$on(get("update"), (data) => {
            if (!!data) {
                vm.snackList = data;
            }
            vm.index++;
        });
        bus.$on(get("odd"), () => {
            this.$refs.goPay.style.opacity = '0.5';
            this.payFlag = true;
            if(browser.WX){
                location.assign(this.options.urlIndex);
                // window.history.go(1-window.history.length)
            }else{
                webBridge.close(4);
            }
        });
    },
    watch: {
        index: function() {
            let vm = this;
            vm.snackArr = [];
            vm.chooseSnack = [];
            const oldValue = vm.userCashCoupon;
            let mealList = localStorage.getItem(`mealList${vm.options.orderDetails.order_code}`);
            if (vm.couponInfo && vm.index == 1) {
                vm.chooseWxPay();
                if (mealList && !vm.bindOrder) {
                    vm.snackList = Object.assign(vm.snackList, JSON.parse(mealList));
                }
                vm.getMealPrice();
            } else {
                vm.getMealPrice();
                vm.isUseCoupon();
            }



            vm.index == 1 && vm.isUseCoupon()

            // if (vm.index == 1 && vm.chooseSnack.length > 0) {
            //     vm.bindOrder = true;
            // }

            if(vm.paytype == "MCARD_PREPARED") {
                if (!vm.couponInfo && vm.snackArr.length > 0  && vm.options.cinemaCardConf["isSupportBuySnack"] == 0) {
                    vm.unSupportCardBySnack();
                }

                if(!!vm.couponInfo && oldValue && !vm.userCashCoupon) {
                    dialogManager.confirm('现金券抵扣不能与影城会员卡支付优惠同时使用，是否继续？', {
                        okText: '用现金券',
                        cancelText: '用会员卡'
                    }).then(res => {
                        vm.chooseWxPay();
                    }).catch(res => {
                        if(vm.snackArr.length > 0 && vm.options.cinemaCardConf["isSupportBuySnack"] == 0) {
                            vm.unSupportCardBySnack();
                        }
                    })
                }
            }
            if(!!vm.options.orderDetails.activity_code && vm.userCashCoupon) {
                dialogManager.confirm('现金券抵扣不能与活动优惠同时享用，是否继续？', {
                    okText: '用现金券',
                    cancelText: '参与活动'
                }).then(res => {
                    vm.options.orderDetails.ticket_pay_amount = Number(vm.options.orderDetails.salePrice) * Number(vm.options.orderDetails.ticket_count);
                    vm.computePrice();
                }).catch(res => {
                    vm.userCashCoupon = false;
                    vm.computePrice();
                })
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
    .arrow-right {
        @include arrow-right;
        padding-left: rem(10px);
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
                   //margin-left: rem(20px);
                    font-size: rem(24px);
                }
            }
        }
        .coupon,
        .active,
        .reduce,
        .total {
            @include display-flex(flex);
            @include justify-content(space-between);
            .action1 {
                @include display-flex(flex);
                @include align-items(center);
            }
            .action3 {
                font-size: rem(36px);
            }
        }
        .total, .reduce, .active {
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
                margin: rem(20px 0);
                font-size: rem(24px);
                height: rem(24px);
                max-width: 5rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            div:nth-child(3) {
                //position: absolute;
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
            position: relative;
            @include wh(40px, 40px);
            font-size: rem(40px);
           // font-weight: bold;
            line-height: rem(40px);
            @include radius(100%);
            text-align: center;
        }
        .reduce:before, .add:before {
            content: '';
            position: absolute;
            left: rem(11px);
            top: rem(20px);
            width: rem(20px);
            height: 1px;
        }
        .add:after {
            content: '';
            position: absolute;
            left: rem(20px);
            top: rem(11px);
            width: 1px;
            height: rem(20px);
        }
        .count {
            font-size: rem(36px);
            line-height: rem(40px);
            padding: rem(0 26px);
        }
        .std-price {
            margin-left: rem(18px);
            font-size: rem(20px);
            white-space: nowrap;
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
            padding: rem(20px 0 20px 24px);
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
           // @include justify-content(center);
            @include align-items(center);
            font-size: rem(28px);
            height: rem(90px);
            .waitpay {
                margin-right: rem(10px);
            }
            .sum {
                margin-top: rem(-10px);
                font-size: rem(42px);
            }
            .service {
                margin-left: rem(10px);
            }
            .payOrder {
                @include wh(276px, 90px);
                position: absolute;
                right: rem(24px);
                bottom: rem(20px);
                font-size: rem(38px);
                line-height: rem(90px);
                text-align: center;
                @include radius(rem(45px));
            }
        }
    }
}
</style>
