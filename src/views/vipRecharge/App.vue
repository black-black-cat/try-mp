<template>
    <div class="m-views-viprecharge">
        <!-- <div class="tips"><i class="icon-light"></i>限时充值优惠：充500送500</div> -->
        <app-content :options="options"></app-content>
        <app-type :options="options"></app-type>
        <app-foot :options="options"></app-foot>
    </div>
</template>
<script>
import appContent from './Content';
import appType from './Type';
import appFoot from './Foot';
import viewport from 'lib/comp/viewport';
import dialogManager from 'common/plugin/dialog';
function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, state.title, state.url);
}
pushHistory();
window.addEventListener("popstate", function(ev) {
    if (viewport.getDeviceType() != "iphone") {
        history.go(-1);
        sessionStorage.setItem('androidback', true);
    }
});

export default {
    props: ["options"],
    data() {
        return{
            rechargeAgain: this.options.data.rechargeAgain
        }
    },
    components: {
        appContent,
        appType,
        appFoot
    },
    mounted() {
        window.addEventListener('pageshow', e => {
            if (e.persisted) {
                location.reload();
            }
        });
        if (this.rechargeAgain == 0) {
            dialogManager.alert("此会员卡暂不支持充值，如有疑问，请咨询影院工作人员", {
                okText: "我知道了"
            }).then(() => {
                dialogManager.wait();
                history.go(-2);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';

.m-views-viprecharge {
    .tips {
        @include display-flex(flex);
        @include align-items(center);
        @include justify-content(center);
        font-size: rem(26px);
        line-height: rem(68px);
        .icon-light{
            margin-right: rem(10px);
        }
    }
}
</style>