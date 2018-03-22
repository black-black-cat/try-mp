<template>
    <div :class="['m-member-card', 'member-card', cardSkin]" @click="openUrl">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
        <div class="container">
            <div class="section-1">
                <!--
                <div class="member-card-top-left">
                    <div class="row-1">{{cardData.cinema_name}}</div>
                    <div class="row-2">{{cardData.cardTypeName}}</div>
                </div>
                <div class="member-card-top-right">{{cardData.cardTypeName}} {{cardData.code}}</div>
                -->
                <div class="row-1 vh-between">
                    <div>{{cardData.cinema_name}}</div>
                    <div>{{cardData.cardTypeName}} {{cardData.code}}</div>
                </div>
                <div class="row-2">{{cardData.member_policy}}</div>
            </div>
            <div class="section-2">
                <div class="member-card-logo">
                    <lazy-image :src="logoSrc"></lazy-image>
                </div>
            </div>
            <div class="section-3">
                <div class="member-card-desc">
                    <span>余额：</span><span class="strong">￥{{cardData.balance}}</span>
                </div>
                <div class="member-card-desc-1">
                有效期至{{cardData.expire_date.split(" ")[0]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
export default {
    props: {
        cardData: {
            type: Object,
            default() {
                return {};
            }
        },
        targetUrl: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: "dark-blue"
        },
        colorCode: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            logoSrcTemp: "/images/common/member-card-logo-#.png",
            colorMap: {
                "dark-blue": 1,
                "yellow": 2,
                "sky-blue": 3,
                "orange": 4,
                "green": 5
            }
        }
    },
    computed: {
        logoSrc()　{
            return this.logoSrcTemp.replace(/#/, this.cardSkin.slice(-1));
        },
        cardSkin() {
            return `member-card-${this.colorCode + 1}`
        }
    },
    components: {

    },
    methods: {
        openUrl() {
            const vm = this;
            if (!vm.targetUrl) return;
            vm.$emit("beforeOpenUrl", {
                data: vm.cardData
            });
            if(browser.WX){
                location.assign(vm.targetUrl);
            }else{
                webBridge.openUrl(vm.targetUrl, "self");
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/_mixin.scss";

.member-card {
    display: inline-block;
    position: relative;
    width: r(546);
    height: r(346);
    @include radius(rem(20px));
    overflow: hidden;

    .container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .section-1 {
        @include align-items(flex-start);
        padding: r(24) r(22) 0;
        min-height: r(75);

        .row-1 {
            @include font-size(22px);

            >div:nth-child(1) {
                @extend %ellipsis-basic;
                @include flex(1);
            }
            >div:nth-child(2) {
                @include font-size(20px);
            }
        }
        .row-2 {
            margin-top: rem(12px);
            @include font-size(28px);
        }
    }
    .section-3 {
        min-height: r(94);
    }
    &-top-left {
        width: 40%;
        .row-1 {
            @include ellipsis();
        }
        .row-2 {
            padding-top: r(10);
            padding-bottom: r(10);
            font-size: r(28);
        }
    }

    &-top-right {
        width: 50%;
        font-size: r(26);
    }

    &-logo {
        position: relative;
        margin: auto;
        max-width: r(205);
        // max-height: r(177);
        height: r(150);
        text-align: center;

        >img {
            height: 100%;
        }
    }

    &-desc {
        padding-top: r(20);
        padding-left: r(24);
        font-size: r(26);
    }

    &-desc-1 {
        //text-align: center;
        margin-top: r(8);
        padding-bottom: r(20);
        padding-left: r(24);
        font-size: r(20);
    }

    .circle-1,
    .circle-2,
    .circle-3 {
        position: absolute;
        @include radius(50%);
    }
    .circle-1 {
        top: -2.2rem;
        left: -2.2rem;
        @include wh(340px, 340px);
    }
    .circle-2 {
        top: -3.5rem;
        left: 3rem;
        @include wh(520px, 520px);
    }
    .circle-3 {
        top: 2.7rem;
        left: -1.3rem;
        @include wh(300px, 300px);
    }
}
</style>
