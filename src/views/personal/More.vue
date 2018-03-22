<template>
    <div class="m-more">
        <div class="title vh-center">
            <span class="name">更多操作</span>
            <i class="icon-dialog-close" @click="close"></i>
        </div>
        <ul class="more-items" v-if="cinemaMode == 1">
            <li class="item"   v-show="cardConfig.isSupportRecharge && option.recharge_again"  v-href="href.urlRecharge" :data-query="makeRechargeUrl(option)">
                <i class="icon-recharge"></i>
                <span class="name">续费充值</span>
            </li>
            <li class="item" @click="findDetail" v-show="cardConfig.isSupportRecord">
                <i class="icon-detail"></i>
                <span class="name">查询明细</span>
            </li>
            <li class="item" v-href="href.urlUnbind" :data-query="'card_id='+option.id+'&cinema_code='+option.cinema_code">
                <i class="icon-unlock"></i>
                <span class="name">解除绑定</span>
            </li>
            <li class="item" @click="findBalance">
                <i class="icon-balance"></i>
                <span class="name">查询余额</span>
            </li>
        </ul>
        <ul class="more-items" v-if="cinemaMode != 1">
            <li class="item"   v-show="option.recharge_again"  v-href="href.urlRecharge" :data-query="makeRechargeUrl(option)">
                <i class="icon-recharge"></i>
                <span class="name">续费充值</span>
            </li>
            <li class="item" @click="findDetail">
                <i class="icon-detail"></i>
                <span class="name">查询明细</span>
            </li>
            <li class="item" v-href="href.urlUnbind" :data-query="'card_id='+option.id+'&cinema_code='+option.cinema_code">
                <i class="icon-unlock"></i>
                <span class="name">解除绑定</span>
            </li>
            <li class="item" @click="findBalance">
                <i class="icon-balance"></i>
                <span class="name">查询余额</span>
            </li>
        </ul>
    </div>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import Pwd from './Pwd.vue'
    import {bus, get} from 'lib/comp/bus'
    import {array, object} from 'common/utils/defaultProps'
    import query from 'lib/json/query'
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"

    export default {
        props: {
            href: object,
            option: object,
            cardConfig: object,
            cinemaMode: null
        },
        methods: {
            close () {
                this.$emit("close");
            },
            clickOk (res) {
                res.popup.postMessage({type: "ok"});
            },
            findDetail () {
                dialogManager.wait();
                this.$http.get(this.href.apiIsChangepwd, {
                    params: {card_id: this.option.id, cinema_code: this.option.cinema_code}
                }).then(res => {
                    let url = this.href.urlDetail;
                    let divide = url.includes("?") ? "&" : "?";
                    dialogManager.closeWait();
                    let newUrl = url + divide + 'card_id='+this.option.id+'&cinema_code='+this.option.cinema_code;
                    if(browser.WX){
                        location.href = newUrl;
                    }else{
                        webBridge.openUrl(newUrl);
                    }
                }).catch(res => {
                    this.findBalance("detail");
                })
            },
            findBalance (type) {
                let vm = this;
                dialogManager.open(Pwd, {
                    top: "25%",
                    tapClose: false,//点击确认按钮是否关闭
                    url: this.href.urlBalance,
                    location: type === "detail" ? query.url(this.href.urlDetail, {card_id: this.option.id, cinema_code: this.option.cinema_code}) : null,
                    data: {card_id: this.option.id, card_code: this.option.code},
                    ok: this.clickOk,
                    buts: [{text: "取消"}, {text: "确定", type: "ok"}],
                    afterShow: vm.afterShow
                });
            },
            makeRechargeUrl(option) {
                return 'card_id='+option.id
                +'&cinema_code='+option.cinema_code
                +'&color_code='+option.color
                +'&member_policy='+option.card_name
            },
            afterShow(res){
                let vm = this;
                if(res) bus.$emit(get("back"), { morePop: res});

            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-more{
        width: rem(750px);
        .title{
            @include height(100px);
            position: relative;
            .name{
                @include flex(1);
                @include font-size(32px);
                text-align: center;
            }
            .icon-dialog-close{
                @include top_center;
                right: rem(34px);
            }
        }
    }

    .more-items{
        @include display-flex;
        @include justify-content(space-between);
        @include flex-wrap(wrap);
        padding: rem(12px 42px 60px);
        .item{
            margin-top: rem(48px);
            text-align: center;
            @include wh(192px);
            @include display-flex;
            @include flex-wrap(wrap);
            @include align-content(flex-end);
            @include justify-content(center);
            @include radius(rem(5px));
            .name{
                padding-top: rem(24px);
                display: block;
                width: 100%;
                @include font-size(28px);
                padding-bottom: rem(42px);
            }
        }
    }

</style>