<template>
    <div class="m-views-openvip" ref="openvip">
        <!-- <div class="tips"><i class="icon-light"></i>限时开卡优惠：首单购票优惠后再五折</div> -->
        <card-message :options="options.data.arrAwardAd" :text="options.data.arrAwardAd ? options.data.arrAwardAd.title : ''" :isTop="true"></card-message>
        <app-header :options="options"></app-header>
        <app-content :options="options" @sendend="sendend"></app-content>
        <app-type :options="options"></app-type>
        <app-foot :options="options"></app-foot>
    </div>
</template>
<script>
import appHeader from './Header';
import appContent from './Content';
import appType from './Type';
import appFoot from './Foot';
import cardMessage from "common/components/cardMessage";

export default {
    props: ["options"],
    data() {
    },
    components: {
        appHeader,
        appContent,
        appType,
        appFoot,
        cardMessage
    },
    methods: {
        sendend() {
            this.$refs.openvip.style.position = "relative";
        }
    }
}
</script>
<style lang="scss">
@import "../../common/style/mixin";
html,body {
    height: 100%;
}
.m-views-openvip {
    height: 100%;
    .tips {
        @include display-flex(flex);
        @include align-items(center);
        @include justify-content(center);
        font-size: rem(26px);
        line-height: rem(68px);
    }
}
</style>