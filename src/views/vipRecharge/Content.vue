<template>
    <div class="m-viprecharge-content">
        <div class="layout-1">
            <member-card :cardData="cardInfo" :colorCode="+urlParams.color_code"></member-card>
        </div>
        <div class="layout-2">
            <div class="title">充值金额：</div>
            <div class="money" ref="money">
                <template v-for="(item,key) in options.data.money">
                    <template v-if="key == 1">
                        <div @click="choose" v-if="item" :data-money="item" class="active"><span>¥</span>{{item}}</div>
                    </template>
                    <template v-else>
                        <div @click="choose" v-if="item" :data-money="item"><span>¥</span>{{item}}</div>
                    </template>
                </template>
            </div>
        </div>
        <div class="layout-3">
            <div>
                <div class="name">会员卡号</div>
                <div>{{options.data.cardInfo.code}}</div>
            </div>
            <div>
                <div class="name">密码</div><input type="password" placeholder="请输入卡号密码" ref="code" v-on:input="password"></div>
        </div>
    </div>
</template>
<script>
import memberCard from "./MemberCard.vue";
import {bus, get} from 'lib/comp/bus';
import query from "lib/json/query";
let urlParams = query.parse(location.search.slice(1));
export default {
    props: ["options"],
    data() {        
        return {
            cardInfor: {
                policyName: '',
                desc: '',
                logoSrc: '',
                firstRechargeAmount: '',
                cardTypeName: '',
                validMonthAmount: '',                
            },
            urlParams: urlParams,
            cardInfo: Object.assign({}, this.options.data.cardInfo, urlParams)
        }
    },
    components: {
        memberCard
    },
    methods: {
        choose: function(ev) {
            let vm = this;
            var target = null;
            if(ev.target.children.length == 0) {
                target = ev.target.parentNode;
            } else {
                target = ev.target;
            }

            for(let item in vm.$refs.money.children) {
                if(vm.$refs.money.children[item].nodeType == 1) {
                    if(vm.$refs.money.children[item].dataset.money == ev.target.dataset.money) {
                        vm.$refs.money.children[item].classList.add("active");
                    } else {
                        vm.$refs.money.children[item].classList.remove("active");
                    }
                }
            }
            bus.$emit(get("choosed"), target.dataset.money);
        },
        password: function() {
            bus.$emit(get("password"), this.$refs.code.value);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';
.m-viprecharge-content {
    position: relative;
    margin-top: rem(138px);
    .layout-1 {
        @include display-flex(flex);
        @include justify-content(center);
        position: absolute;
        width: 100%;
        top: rem(-86px);
        z-index: 100;
    }
    .layout-2 {
        position: relative;
        padding: rem(310px 34px 50px 34px);
        margin: rem(0 24px);
        @include radius(rem(20px));
        .title {
            font-size: rem(28px);
        }
    }
    .money {
        >div {
            display: inline-block;
            margin-top: rem(40px);
            margin-left: rem(20px);
            @include wh(186px, 72px);
            font-size: rem(36px);
            line-height: rem(72px);
            text-align: center;
            @include radius(rem(36px));
            span {
                font-size: rem(26px);
            }
        }
        >div:nth-child(3n+1) {
            margin-left: 0;
        }
    }
    .layout-3 {
        @include display-flex(flex);
        @include flex-direction(column);
        margin-top: rem(24px);
        padding-left: rem(34px);
        >div {
            @include display-flex(flex);
            @include justify-content(flex-start);
            @include align-items(center);
            height: rem(100px);
            font-size: rem(30px);
            input {
                border: none;
                line-height: normal;
            }
        }

        .name {
            min-width: rem(176px);
        }
    }
}
</style>