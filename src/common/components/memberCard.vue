<template>
    <div class="m-member-card-container" :class="[cardSkin]">
        <div :class="['m-member-card', 'member-card', cardSkin]" @click="openUrl">
            <div class="circle-1"></div>
            <div class="circle-2"></div>
            <div class="circle-3"></div>
            <div class="member-card-logo">
                <lazy-image :src="logoSrc" :class="{col: isColImg}"></lazy-image>
            </div>
            <div class="container">
                <div class="section-1 vh-between">
                    <div class="member-card-top-left">
                        <div class="row-1">{{cinemaName}}</div>
                        <div class="row-2">{{cardData.policyName}}</div>
                    </div>
                    <div class="member-card-top-right">{{cardData.desc}}</div>
                </div>
                <div class="section-2">
                    <card-message :text="'送开卡礼包'"></card-message>
                </div>
                <div class="section-3">
                    <div class="member-card-desc">
                        <span>开卡金额：</span>
                        <span class="strong">￥{{cardData.firstRechargeAmount}}</span>
                    </div>
                    <div class="member-card-desc-1">
                        {{cardData.cardTypeName}}(有效期{{cardData.validMonthAmount}}个月)
                    </div>
                </div>
            </div>
        </div>
        <div class="tag icon-member-card-tag" v-if="isRecommend">推荐</div>
    </div>
</template>

<script>
import webBridge from 'common/utils/webBridge'
import browser from 'lib/util/browser'
import cardMessage from "common/components/cardMessage"

export default {
    props: {
        cardData: {
            type: Object,
            default() {
                return {};
            }
        },
        cinemaName: {
            type: String,
            default: ""
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
        },
        isRecommend: {
            type: Boolean,
            default: false
        },
        canOpen: {
            type: Boolean,
            default: true
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
        logoSrc() {
            return this.logoSrcTemp.replace(/#/, this.cardSkin.slice(-1));
        },
        cardSkin() {
            return `member-card-${this.colorCode + 1}`
        },
        isColImg() {
            let num = this.colorCode + 1;
            return num == 3 || num == 5;
        }
    },
    components: {
        cardMessage
    },
    methods: {
        openUrl() {
            const vm = this;
            if (!vm.canOpen) {
                return;
            }
            if (!vm.targetUrl) return;
            vm.$emit("beforeOpenUrl", {
                data: vm.cardData
            });
            let divide = vm.targetUrl.includes("?") ? "&" : "?";
            let url = vm.targetUrl + divide + "policyId=" + vm.cardData.policyId;
            if(browser.WX){
                location.assign(url);
            }else{
                webBridge.openUrl(url);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin";

.m-member-card-container {
    position: relative;
    display: inline-block;
    .icon-member-card-tag {
        position: absolute;
        left: r(-10);
        bottom: r(33);
        @include font-size(20px);
        line-height: r(36);
        text-align: left;
        text-indent: 0.3em;
    }
}



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
        text-align: left;
    }

    .section-2 {
        position: relative;
        height: r(150);

        .m-card-message {
            position: absolute;
            top: 0;
            right: rem(24px);
        }
    }

    &-top-left {
        @include flex(1);
        width: 50%;
        .row-1 {
            @include ellipsis();
        }
        .row-2 {
            padding-top: r(10);
            padding-bottom: r(10);
            font-size: r(28);
            @include ellipsis();
        }
    }

    &-top-right {
        @include flex(1);
        @include ellipsis();
        font-size: r(26);
        text-align: right;
    }

    &-desc {
        padding-top: r(8);
        padding-bottom: r(8);
        font-size: r(26);
        text-align: center;

        >.strong {
            font-size: r(36);
        }
    }

    &-desc-1 {
        text-align: center;
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
    .member-card-logo {
        position: absolute;
        bottom: r(88);
        width: 100%;
        text-align: center;

        >img {
            width: r(200);

            &.col {
                width: r(170);
            }
        }
    }
}
</style>
