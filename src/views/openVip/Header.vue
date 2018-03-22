<template>
    <div class="m-openvip-header">
        <div class="layout-1">
            <member-card :cardData="this.cardInfor"
            :cinemaName="cinemaData.cinema_name"
            :cardSkin="`member-card-${this.cardInfor.cardType}`"
            :colorCode="cardInfor.color"
            ></member-card>
        </div>
        <!-- <div class="layout-2">
            <div class="item">
                <div><i class="icon-open-vip"></i></div>
                <div>会员权益</div>
                <div>最高6折<br/>网售折上折</div>
            </div>
            <div class="item">
                <div><i class="icon-gift"></i></div>
                <div>开卡礼包</div>
                <div>开卡送券<br/>券可叠加使用</div>
            </div>
            <div class="item">
                <div><i class="icon-shop"></i></div>
                <div>线下权益</div>
                <div>卖品小吃 明星首映<br/>优速购票去到</div>
            </div>
        </div> -->
        <div class="another" v-href="options.href.urlMemberPolicy">换一张</div>
        <div class="layout-3" @click="detail">查看会员政策详情<i class="arrow-right"></i></div>
    </div>
</template>
<script>
import memberCard from "common/components/memberCard.vue";
import popup from 'lib/layer/popup';
import policy from './Policy.vue';
export default {
    props: ["options"],
    data() {
        return {
            cardInfor: this.options.data.cardInfo,
            cinemaData: this.options.data.cinema
        }
    },
    components: {
        memberCard
    },
    methods: {
        detail() {
            const vm = this;
            vm.m_dialog_policy = popup("<policy @close='close' :options='options'></policy>", {
                option: {
                    autoHide: true,
                    overlay: {
                        show: true,
                        opacity: 0.5
                    },
                    animate: {
                        name: "slide-bottom"
                    },
                    progressBar: {
                        show: false,
                    }
                },
                popup: {
                    data() {
                        return {
                            options: vm.options
                        };
                    },
                    methods: {
                        close() {
                            vm.m_dialog_policy.hide();
                        }
                    },
                    components: {
                        policy
                    }
                }
            });
            vm.m_dialog_policy.show(0, "auto", "auto", 0);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-openvip-header {
    margin: rem(136px 24px 24px 24px);
    @include radius(rem(10px));
    .layout-1 {
        @include display-flex(flex);
        @include justify-content(center);
        position: relative;
        top: rem(-86px);
    }
    .another {
        @include wh(180px, 62px);
        margin: rem(-62px 0 50px 262px);
        font-size: rem(30px);
        line-height: rem(62px);
        text-align: center;
        @include radius(rem(31px));
    }
    .layout-2 {
        @include display-flex(flex);
        padding-top: rem(60px);
        padding-bottom: rem(48px);
        >div {
            @include flex(1);
            text-align: center;
        }
        .item {
            div:nth-child(2) {
                padding: rem(24px 0 12px 0);
                font-size: rem(30px);
            }
            div:last-child{
                font-size: rem(22px);
                line-height: rem(26px);
            }
        }
    }
    .layout-3 {
        font-size: rem(30px);
        line-height: rem(92px);
        text-align: center;
    }
    .arrow-right {
        @include arrow-right;
        padding-left: rem(20px);
    }
}
</style>