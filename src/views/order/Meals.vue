<template>
    <div class="m-order-meals">
        <div class="title">
            <div>观影美食</div>
            <div class="icon-dialog-close" @click="close"></div>
        </div>
        <div class="layout-1" data-bind-scroll>
            <div class="item" v-for="(item, key) in mealInfo">
                <div class="img">
                    <lazy-image :src="item.image" init-src="/images/common/meal-default.jpg"/>
                </div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="content">{{item.remark}}</div>
                    <div class="price">¥{{item.net_price}}<span class="std-price">门市价<span>¥{{item.std_price}}</span></span></div>
                </div>
                <div class="sum" :data-code="item.code">
                    <div class="reduce" v-if="item.count > 0" @click.stop="more"></div>
                    <div class="count" v-if="item.count > 0">{{item.count}}</div>
                    <div class="add" @click.stop="more"></div>
                </div>
            </div>
        </div>
        <div class="layout-2">
            <div class="list">
                <template v-for="item in mealInfo">
                    <div class="item1" v-if="item.count > 0">
                        <div :data-code="item.code">{{item.name}}x{{item.count}}
                            <span @click="cancel"></span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="item2" v-if="this.payAmount >= 0">
                <div>
                    <span class="waitpay">共计</span>¥</div>
                <div class="sum">{{parseFloat(payAmount.toFixed(2).toString())}}</div>
                <div class="service" v-if="this.fee == 0">含服务费¥0</div>
                <div class="service" v-if="this.fee > 0">含服务费¥{{parseFloat(cost.fee.toFixed(2).toString())}}</div>
                <div class="payOrder" @click="mealsConfirm">选好了</div>
            </div>
        </div>
    </div>
</template>
<script>
import dialogManager from 'common/plugin/dialog';
import { bus, get } from 'lib/comp/bus';
import clone from 'lib/json/clone';
export default {
    props: {
        options: null,
        cost: null,
        price:null
    },
    data() {
        return {
            inital: {},
            mealInfo: null,
            payAmount: this.cost.amount,
            fee: this.cost.fee,
            onlyTicketPrice: 0,
        }
    },
    methods: {
        mealsConfirm() {
            let vm = this;
            bus.$emit(get("update"));
            vm.$emit("close");
        },
        close() {
            let vm = this;
            bus.$emit(get("update"), vm.inital);
            vm.$emit("close");
        },
        more(ev) {
            const vm = this;
            let num = 0;
            let price1 = 0;
            let price2 = 0;

            vm.mealArr = [];
            for (let item in vm.options) {
                num += vm.options[item]["count"];
                price2 += vm.options[item].count*vm.options[item]["net_price"];
            }
            if (ev.target.classList.contains("add") && (num == 4)) {
                dialogManager.toast("卖品最多选择4个，请重新选择");
                return;
            }
            for (let item in vm.options) {
                if (vm.options[item].code == ev.target.parentNode.dataset.code) {
                    if (ev.target.classList.contains("add")) {
                        if (num < 4) {
                            vm.options[item]["count"]++;
                        }
                    }
                    if (ev.target.classList.contains("reduce")) {
                        vm.options[item]["count"]--;
                    }
                }
                price1 += vm.options[item].count*vm.options[item]["net_price"];
            }
            vm.computePrice(price1,price2);
        },
        cancel(ev) {
            let vm = this;
            let code = ev.target.parentNode.dataset.code;
            let price1 = 0;
            let price2 = 0;
            for(let item in vm.options) {
                 price2 += vm.options[item].count*vm.options[item]["net_price"];
            }
            for (let item in vm.options) {
                if (code == vm.options[item].code) {
                    vm.options[item].count = 0;
                }
                price1 += vm.options[item].count*vm.options[item]["net_price"];
            }
            vm.computePrice(price1,price2);
        },
        computePrice(p1,p2){
            let vm = this;
            p1 = +p1;p2 = +p2;
            if(vm.price){
                if(vm.price.couponInfo.minprice > p1 ){//不能用券
                    vm.payAmount = (+vm.price.ticket_price) + p1;
                }else{
                    let mealPrice = p1 - (+vm.price.couponInfo.price);
                    vm.payAmount = (+vm.price.ticket_price) + (mealPrice > 0 ? mealPrice : 0);
                }
            }else{
                let price = (+vm.payAmount) + p1 - p2;
                vm.payAmount = (price < 0 || price === 0 ) ? +vm.payAmount : price;
            }
        }
    },
    watch: {
        cost(val) {
            this.payAmount = val.amount;
            this.fee = val.fee;
        },
        options(val) {
            this.mealInfo = val;
        }
    },
    created() {
        const vm = this;
        bus.$on(get("mealList"), (data) => {
            //vm.inital = Object.assign({}, data);
            vm.inital = clone(data);
        })
    }
}
</script>
<style lang="scss">
@import "../../common/style/mixin";
.m-order-meals {
    @include display-flex(flex);
    @include flex-direction(column)
    width: rem(750px);
    .title {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        padding: rem(0 34px 0);
        font-size: rem(32px);
        height: rem(100px);
        line-height: rem(100px);
        >div:nth-child(1) {
            flex: 1;
            text-align: center;
        }
    }
    .layout-1 {
        max-height: rem(702px);
        min-height: rem(468px);
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        .item {
            @include display-flex(flex);
            position: relative;
            padding: rem(34px);
            .info {
                margin-left: rem(24px);
            }
            .name {
                margin-top: rem(10px);
                font-size: rem(32px);
            }
            .content {
                max-width: rem(312px);
                margin-top: rem(20px);
                font-size: rem(22px);
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .price {
                position: absolute;
                bottom: rem(30px);
                font-size: rem(32px);
            }
            .sum {
                @include display-flex(flex);
                @include align-items(center);
                position: absolute;
                top: rem(84px);
                right: rem(34px);
            }
            .reduce,
            .add {
                @include wh(40px, 40px);
                position: relative;
                // font-size: rem(40px);
                // line-height: rem(40px);
                @include radius(100%);
                text-align: center;
            }
            .reduce:before, .add:before {
                content: '';
                position: absolute;
                left: rem(10px);
                top: rem(20px);
                width: rem(20px);
                height: 1px;
            }
            .add:after {
                content: '';
                position: absolute;
                left: rem(19px);
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
        .img {
            @include wh(166px, 166px);
            @include radius(rem(10px));
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .layout-2 {
        .item1 {
            padding: rem(20px 24px 0 24px);
            float: left;
        }
        .item1>div {
            display: inline-block;
            padding: rem(7px 20px);
            font-size: rem(30px);
            @include radius(rem(100px));
            span {
                margin-left: rem(10px);
                &:after {
                    content: "\00D7";
                    font-size: 120%;
                }
            }
        }
        .item1:nth-child(n+2) {
            //margin-top: rem(20px);
        }
        .item2 {
            clear: both;
            @include display-flex(flex);
            @include align-items(center);
            @include justify-content(center);
            @include flex-shrink(1);
            position: relative;
            padding-top: rem(40px);
            padding-bottom: rem(20px);
            font-size: rem(28px);
            .waitpay {
                margin-right: rem(10px);
            }
            .sum {
                margin-top: rem(-10px);
                font-size: rem(42px);
            }
            .service {
                margin: rem(0 10px);
            }
            .payOrder {
                @include wh(300px, 90px);
                font-size: rem(38px);
                line-height: rem(90px);
                text-align: center;
                @include radius(rem(45px));
            }
        }
    }
}
</style>
