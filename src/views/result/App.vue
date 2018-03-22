<template>
    <div class="m-pay-result">
        <template v-if="options.data">
            <div class="layout-1">
                <div><i class="icon-pay-success"></i>支付成功</div>
                <template v-if="options.data.SnackList.length > 0">
                    <div>系统正在出票，请稍后在订单中查看</div>
                </template>
                <prize :options="options.arrAwardAd" :orderType="options.orderType"></prize>
                <!-- <div>Tips: 本次交易获得四十积分奖励，积分可兑换礼品哦！</div> -->
                <div class="tabs">
                    <div  @click="toPage(options.href.urlIndex)">返回首页</div>
                    <div v-href="options.href.urlOrder">查看订单</div>
                    <div v-if="!!options.FtypeBannerImage && options.FtypeBannerImage.ftype" class="pic">
                        <img src="/images/common/btn_award.png" alt=""  @click="goPage">
                    </div>
                </div>
            </div>

            <template v-if="options.data.SnackList.length > 0">
                <div class="layout-2">
                    <div class="tips">
                        <div>据说爆米花和电影更配哟</div>
                    </div>
                    <div class="meal" v-for="item in options.data.SnackList">
                        <div class="img">
                            <lazy-image :src="item.image" initSrc="/images/common/meal-default.jpg"/>
                        </div>
                        <div class="info">
                            <div>{{item.name}}</div>
                            <div>{{item.remark}}</div>
                            <div>¥{{item.settle_price}}<span class="std-price">门市价<span>¥{{item.std_price}}</span></span></div>
                        </div>
                        <div class="shop" @click="toPage(options.href.urlSnack)">
                            去选购
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <template v-else>
            <div class="layout-1">
                <div><i class="icon-pay-success"></i>支付成功</div>
                <div>正在获取会员卡，请稍后...</div>
                <div class="backbtn" @click="toPage(options.href.urlMy)">
                    <div>返回个人中心</div>
                </div>
            </div>
        </template>
        <div class="layout-3" v-if="options.bannerImage && options.bannerImage.length > 0">
            <lazy-image v-href="options.bannerImage[0].img" :src="options.bannerImage[0].img"/>
            <ad-compass :ad="options.bannerImage[0]" v-if="options.bannerImage[0].contentID"/>
        </div>
    </div>
</template>
<script>
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import * as comp from "lib/comp/bus"
import dialogManager from "common/plugin/dialog"
import adCompass from "common/components/adCompass"
import Prize from "./Prize"

export default {
    props: ["options"],
    data() {
        return {
            starttime: '',
            endtime: ''
        }
    },
    components: {
        adCompass,
        Prize
    },
    methods: {
        toPage(url){
            !!browser.WX ? (location.href = url) : webBridge.popToSelectedController(url, "self");
        },
        goPage() {
            const vm = this;

            if(!!vm.options.FtypeBannerImage.type == 'normal') {
                !!browser.WX ? location.assign(vm.options.FtypeBannerImage.url) : webBridge.openUrl(vm.options.FtypeBannerImage.url);
            }

            if(vm.options.FtypeBannerImage.type != 'act_play') return;
            if(comp.isLock()) return;
            comp.lock();
            dialogManager.wait();
            this.$http.get(vm.options.FtypeBannerImage.urlActview, {
                params: {
                    ftype: vm.options.FtypeBannerImage.ftype,
                    type: vm.options.FtypeBannerImage.type,
                    starttime: vm.options.FtypeBannerImage.starttime,
                    endtime: vm.options.FtypeBannerImage.endtime,
                    rt: JSON.parse(vm.options.FtypeBannerImage.params)["r"],
                    url: JSON.parse(vm.options.FtypeBannerImage.params)["url"],
                    id: JSON.parse(vm.options.FtypeBannerImage.params)["id"],
                    "is_login": JSON.parse(vm.options.FtypeBannerImage.params)["is_login"],
                    "biz_code": JSON.parse(vm.options.FtypeBannerImage.params)["biz_code"]
                }
            }).then(res => {
                comp.unLock();
                dialogManager.closeWait();
                if(!!res) {
                    !!browser.WX ? location.assign(res["data"]) : webBridge.openUrl(res["data"]);
                }
            }).catch(res => {
                comp.unLock();
                dialogManager.closeWait();
                dialogManager.toast(res["msg"]);
            })
        }
    },
    mounted(){
        webBridge.onBackPressed = function () {
            webBridge.close(4);
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
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
            padding-bottom: rem(64px);
            >div {
                display: inline-block;
                width: rem(180px);
                height: rem(32px);
                padding: rem(16px 0);
                font-size: rem(32px);
                @include radius(rem(41px));
            }
            >div:nth-child(2) {
                margin-left: rem(30px);
            }
            .pic {
                margin-left: rem(16px);
                width: rem(160px);
                padding: 0;
                border: none;
            }
            img {

                width: 100%;
            }

        }
        .backbtn {
            @include display-flex(flex);
            @include justify-content(center);
            padding: rem(80px 0 62px 0);
            div{
                display: inline-block;
                padding: rem(16px);
                font-size: rem(32px);
                @include radius(rem(41px));
            }
        }
    }
    .layout-2 {
        margin-top: rem(24px);
        padding: rem(34px 24px 0 24px);
        .tips {
            @include display-flex(flex);
            @include justify-content(space-between);
            font-size: rem(28px);
        }
        .meal {
            position: relative;
            padding: rem(34px 0);
            @include display-flex(flex);
        }
        .meal:last-child {
            border-bottom: none;
        }
        .img {
            @include wh(140px, 140px);
            @include radius(rem(10px));
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .info {
            position: relative;
            margin-top: rem(10px);
            margin-left: rem(20px);
            div:nth-child(1) {
                font-size: rem(28px);
            }
            div:nth-child(2) {
                margin-top: rem(20px);
                font-size: rem(24px);
                max-width: 5rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            div:nth-child(3) {
                position: absolute;
                bottom: rem(8px);
                font-size: rem(30px);
            }
            .std-price {
                margin-left: rem(18px);
                font-size: rem(20px);
                white-space: nowrap;
            }
        }
        .shop {
            position: absolute;
            right: 0;
            top: rem(39px);
            padding: rem(17px 0);
            width: rem(138px);
            font-size: rem(28px);
            text-align: center;
            @include radius(rem(31px));
        }
    }
    .layout-3 {
        margin: rem(50px 0);
        img {
            width: 100%;
        }
    }
}
</style>

