<template>
    <section class="m-content" :class="{finish: false/*options.order_status != 1*/}">
        <div class="order-status vh-between">
            <span class="name">{{options.cinema_name}}</span>
            <template v-if="options.order_status == '4'">
                <span v-if="options.ticket_status == '3'" class="error">{{options.ticket_status_name}}</span>
                <span v-if="options.ticket_status == '1'" class="status">{{options.ticket_status_name}}</span>
                <span v-if="options.ticket_status == '2'" class="status">{{options.ticket_status_name}}</span>
                <span v-if="options.ticket_status == '5'" class="status">{{options.ticket_status_name}}</span>
                <span v-if="options.ticket_status == '6'" class="error">{{options.ticket_status_name}}</span>
            </template>
            <span v-else :class="tag()">{{options.order_status_name}}</span>
        </div>
        <div class="order-detail">
            <div class="title vh-left">
                <span class="name">{{options.film_name}}</span>
                <span class="lang">{{options.show_type_name}}</span>
            </div>
            <div class="video-hall vh-left">
                <span class="hall">{{options.hall_name}}</span>
                <span class="seat">
                    <template v-for="item in options.seats">{{item}}&nbsp;&nbsp;</template>
                </span>
            </div>
            <div class="film-date vh-left"><span class="date">{{options.show_time}}</span><!--<span class="week">周五</span><span class="time">21:45-23:15</span>--></div>
            <div class="goods" v-if="this.num > -1">
                <div class="good-code vh-left"><span>卖品验证码</span><span class="code">{{options.verify_no}} </span></div>
                <ul class="combo-items" ref="comb">
                    <li class="combo-item vh-left" v-for="item in options.snacks">{{item}}</li>
                </ul>
                <div class="more vh-center" @click="toggle" v-if="num > 0"><span>{{text}}</span><i class="arrow-down" :class="{'arrow-top': isOpen}"></i></div>
            </div>
            <div class="split-line"></div>
            <div class="take-ticket"
                v-if="options.order_status == '6' || ( options.order_status == '4' && options.ticket_status == '2' )"
            >
                <div class="ticket-code vh-center">
                    <span>取票码</span><span class="code" :class="{disabled: disabledQR}">{{options.print_no}}</span>
                </div>
                <div class="ticket-code vh-center">
                    <span>验证码</span><span class="code" :class="{disabled: disabledQR}">{{options.verify_no}}</span>
                </div>
                <div class="qr-code vh-center">
                    <div ref="qrCode"></div>
                </div>
                <ul class="ticket-items">
                    <li>取票方式：请到影院内自助机取电影票和卖品票</li>
                    <li>订单号：{{options.cinemaOrderCode ? options.cinemaOrderCode : options["order_code"]}}</li>
                    <li>实付：¥{{options.pay_amount}}</li>
                </ul>
            </div>
            <div class="take-ticket" v-else>
                <div class="ticket-message vh-center">
                    {{showMessage()}}
                </div>
                <a class="tel vh-center" v-if="options.client_tel" :href="'tel://' + options.client_tel">
                    联系影城
                </a>
                <ul class="ticket-items">
                    <li>订单号：{{options.cinemaOrderCode ? options.cinemaOrderCode : options["order_code"]}}</li>
                    <li>实付：¥{{options.pay_amount}}</li>
                </ul>
            </div>
            <div class="finish-logo"></div>
        </div>
    </section>
</template>
<script>
    import {isArray} from 'lib/util/dataType'
    import QrCode from 'lib/util/qrcode'
    import viewport from 'lib/comp/viewport'

    export default {
        props: {
            options: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            const num = isArray(this.options.snacks) ? this.options.snacks.length - 1 : -1;
            return {
                text: "展开剩余" +num+ "条",
                isOpen: false,
                num: num,
                ticketMessages: {
                    "1": "【该订单已支付成功，因票务系统故障导致未正常出票，涉及的费用会按照付款方式7个工作日内退回到您的账户。如有疑问，请与影城工作人员联系】",
                    "2": "",
                    "3": "【该订单已支付成功，因票务系统故障导致未正常出票，涉及的费用会按照付款方式7个工作日内退回到您的账户。如有疑问，请与影城工作人员联系】",
                    "5": "【该订单已支付成功，正在出票中，请稍候】",
                    "6": "【该订单已支付成功，因票务系统故障导致未正常出票，涉及的费用会按照付款方式7个工作日内退回到您的账户。如有疑问，请与影城工作人员联系】"
                },
                payFailMessage: "【该订单已支付失败，请重新尝试支付，或 重新购买。如有疑问，请与影城工作人员联系】",
                refundFailMessage: "【该订单退款失败，如有疑问，请与影城工作人员联系】",
                disabledQR: this.options.order_status != 4
            }
        },
        mounted () {
            const sp = viewport.rem() / 75;
            this.$refs.qrCode && new QrCode(this.$refs.qrCode, {
                text: this.options.print_no + "|" + this.options.verify_no,
                width: 328 * sp,
                height: 328 * sp,
                colorDark : this.options.order_status == 4 ? "#000000" : "#b2b2b2",
                colorLight : "#ffffff",
                correctLevel : QrCode.CorrectLevel.H
            });
        },
        methods: {
            toggle () {
                const comb = this.$refs.comb;
                const sHeight = comb.scrollHeight;
                const oHeight = comb.offsetHeight;
                if(sHeight === oHeight){
                    this.isOpen = false;
                    this.text = "展开剩余" +this.num+ "条";
                    comb.style.removeProperty("height");
                }else{
                    this.isOpen = true;
                    this.text = "收起";
                    comb.style.height = sHeight + "px";
                }
            },

            tag() {
                const opts = this.options;
                return opts.order_status == 5 || opts.order_status == 7
                    ? "error"
                    : "status"
            },

            showMessage() {
                const vm = this;
                return vm.options.order_status == '5' ? vm.payFailMessage
                    : vm.options.order_status == '7' ? vm.refundFailMessage
                    : vm.options.order_status == '4' ? vm.ticketMessages[vm.options.ticket_status]
                    : ""
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-content{
        padding: rem(34px 24px);
        &.finish{
            .order-detail{
                position: relative;
            }
            .finish-logo{
                position: absolute;
                @include wh(136px, 139px);
                background: img-url(finish) no-repeat;
                @include size;
                bottom: rem(698px);
                right: rem(60px);
            }
        }
    }
    .order-status{
        @include height(80px);
        @include radius(5px 5px 0 0);
        padding: rem(0 20px);
        @include font-size(28px);
    }
    .order-detail{
        padding: rem(0 20px);
        @include radius(0 0 5px 5px);
       .title{
           padding-top: rem(40px);
           .name{
               @include font-size(36px);
           }
           .lang{
               @include font-size(26px);
               padding: rem(12px 0 0 10px);
           }
       }
        .video-hall{
            @include font-size(24px);
            padding-top: rem(30px);
            .seat{
                padding: rem(3px 0 0 20px);
                @extend %ellipsis-basic;
            }
        }
        .film-date{
            padding: rem(28px 0 38px);
            @include font-size(28px);
            .date,.week{
                padding-right: rem(20px);
            }
        }
    }
    .goods{
        padding-top: rem(28px);
        .good-code{
            @include font-size(28px);
            .code{
                @include font-size(36px);
                padding-left: rem(15px);
            }
            padding-bottom: rem(20px);
        }
        .combo-items{
            overflow: hidden;
            @include height(48px);
            @include transition(height 0.3s ease);
        }
        .combo-item{
            @include font-size(28px);
            @include height(48px);
        }
        .more{
            padding: rem(14px 0 24px);
            @include font-size(26px);
            .arrow-down{
                @include arrow-down;
                margin-left: rem(10px);
                @include transition(all 0.3s ease);
                &.arrow-top{
                    @include rotate(-180deg);
                }
            }
        }
    }
    .split-line{
        position: relative;
        height: 0;
        &:before,&:after{
            position: absolute;
            content: "";
            @include wh(30px);
            @include radius(30px);
            z-index: 1;
            top: rem(-15px);
        }
        &:before{
            left: rem(-36px);
        }
        &:after{
            right: rem(-36px);
        }
    }
    .take-ticket{
        padding-top: rem(28px);
    }
    .ticket-code{
        padding-top: rem(20px);
        @include font-size(28px);
        .code{
            @include font-size(42px);
            padding-left: rem(12px);
        }
    }
    .take-ticket .tel {
        width: rem(158px);
        height: rem(58px);
        margin: rem(30px auto 0);
        line-height: rem(58px);
        font-size: rem(28px);
        @include radius(rem(30px));
        text-align: center;
    }
    .qr-code{
        @include wh(378px);
        @include radius(6px);
        margin: rem(40px auto 0);
    }
    .ticket-items{
        padding: rem(38px 0);
        @include font-size(26px);
        li{
            @include lh(48px);
            @extend %ellipsis-basic;
        }
    }
</style>
