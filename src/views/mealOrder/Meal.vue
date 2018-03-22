<template>
    <div class="m-view-mealorder">
        <div class="name">{{options.cinema_name}}</div>
        <div class="list">
            <div class="item" v-for="item in options.snacks">
                <div>
                    <div class="count">{{item.name}}<span v-if="item.count > 1">x{{item.count}}</span></div>
                    <div class="remark">{{item.remark}}</div>
                </div>
                <div class="price">¥{{item.settle_price*item.count}}</div>
            </div>
        </div>
        <template v-if="ticketAndCoupon">
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
        <template v-if="reduce > 0">
            <div class="reduce">
                <div>优惠金额</div>
                <div class="action4">-¥{{parseFloat((reduce).toFixed(2).toString())}}</div>
            </div>
        </template>
        <div class="total"><div>小计</div><div>¥{{this.payAmount > 0 ? parseFloat((this.payAmount).toFixed(2).toString()) : 0}}</div></div>
    </div>
</template>
<script>
import {bus, get} from 'lib/comp/bus';
import viewport from 'lib/comp/viewport';
import browser from "lib/util/browser";
import webBridge from "common/utils/webBridge";
import dialogManager from "common/plugin/dialog";

export default {
    props: {options: null, url: null},
    data () {
        return {
            payAmount: this.options.snack_pay_amount || 0,
            userCashCoupon: false,
            reduce: 0,
            ticketAndCoupon: this.url || '',
            couponInfo: localStorage.getItem(`coupon.selectedItems${this.options.order_code}`) ? JSON.parse(localStorage.getItem(`coupon.selectedItems${this.options.order_code}`))[0] : null,
        }
    },
    methods: {
        goCoupon() {
            const vm = this;
            let couponurl = this.ticketAndCoupon + '&pricesell='+ vm.options.snack_pay_amount + '&itemname=2&ordercode='+ vm.options.order_code;
            
            if (viewport.getDeviceType() === "iphone") {
                window.localStorage.setItem("goneCoupon", true);
            }
            function couponPage() {
                if(browser.WX){
                    location.assign(couponurl);
                } else {
                    webBridge.openUrl(couponurl);
                }
            }
            if(vm.paytype == "MCARD_PREPARED") {
                dialogManager.confirm('现金券抵扣不能与影城会员卡支付优惠同时使用，是否继续？', {
                    okText: '用现金券',
                    cancelText: '用会员卡'
                }).then(res => {
                    couponPage();
                }).catch(res => {
                    console.log(res);
                })
                return;
            } 
            if(vm.paytype == "WECHAT_JS") {
                couponPage();
            }
        }
    },
    created() {
        bus.$on(get('paytype'), (data) => {
            if(!data) return;
            this.paytype = data;
        })
        bus.$on(get('userCashCoupon'), (data) => {
            this.userCashCoupon = data;
        })
        bus.$on(get("amount"), (data) => {
            this.payAmount = data;
        })
        bus.$on(get("price"), (data) => {
            //alert(data);
        })
    },
    watch: {
        userCashCoupon() {
            if(this.userCashCoupon) {
                this.reduce = this.couponInfo.price;
                this.payAmount = Number(this.payAmount);
            } else {
                this.reduce = 0;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';

.m-view-mealorder {
    padding-left: rem(24px);
    .arrow-right {
        @include arrow-right;
        padding-left: rem(10px);
    }
    >div {
        padding-right: rem(24px);
    }
    .name {
        padding: rem(76px 0 30px 0);
        font-size: rem(36px);
    }
    .list {
        padding: rem(30px 0);
    }
    .item {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        @include flex(1);
        padding-right: rem(24px);
        .count {
            font-size: rem(32px);
        }
        .remark {
            margin-top: rem(20px);
            font-size: rem(22px);
        }
        &:nth-child(n+2) {
            margin-top: rem(44px);
        }
        .price {
            font-size: rem(28px);
        }
    }
    .coupon,.total, .reduce {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        font-size: rem(28px);
        line-height: rem(86px);
    }

    .total>div:last-child{
        font-size: rem(36px);
    }
}
</style>

