<template>
    <div class="m-pay-result">
        <div class="layout-1">
            <div class="fail">
                <i class="icon-pay-fail"></i>支付失败</div>
            <div>请检查网络是否正常，可前往订单完成支付</div>
            <div>Tips: 本次交易获得四十积分奖励，积分可兑换礼品哦！</div>
            <div class="tabs">
                <div v-href="options.href.urlIndex">返回首页</div>
                <div v-href="options.href.urlOrder">查看订单</div>
            </div>
        </div>
        <div class="layout-3" v-if="options.bannerImage && options.bannerImage.length > 0">
            <lazy-image v-href="options.bannerImage[0].url" :src="options.bannerImage[0].img"/>
            <ad-compass :ad="options.bannerImage[0]" v-if="options.bannerImage[0].contentID"/>
        </div>
    </div>
</template>
<script>
    
    import adCompass from "common/components/adCompass"

    export default {
        props: ["options"],
        components: {
            adCompass
        },
        data() {
            return {
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-pay-result {
    .layout-1 {
        padding-top: rem(102px);
        text-align: center;
        >div:nth-child(1) {
            @include display-flex(flex);
            @include align-items(center);
            @include justify-content(center);
            font-size: rem(48px);
            text-align: center;
            i {
                margin-right: rem(20px);
            }
        }
        >div:nth-child(2) {
            margin-top: rem(24px);
            font-size: rem(28px);
        }
        >div:nth-child(3) {
            margin-top: rem(20px);
            font-size: rem(22px);
        }
        .tabs {
            @include display-flex(flex);
            @include justify-content(center);
            margin-top: rem(86px);
            padding-bottom: rem(54px);
            >div {
                display: inline-block;
                width: rem(290px);
                padding: rem(25px 0);
                font-size: rem(32px);
                @include radius(rem(41px));
            }
            >div:nth-child(2) {
                margin-left: rem(40px);
            }

        }
    }
    .layout-3 {
        position: absolute;
        bottom: rem(50px);
        left: 0;
        img {
            width: 100%;
        }
    }
}
</style>

