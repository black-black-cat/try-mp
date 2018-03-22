<template>
    <div v-if="type == 1 || type == 3" :class="['m-member-card', 'member-card', cardSkin]" @click="showMore">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
        <div class="overlay" v-if="type == 3"></div>
        <div class="container">
            <div class="section-1 vh-between">
                <div class="row-1">{{option.cinema_name}}</div>
                <div class="row-2" v-if="type == 1">{{option.cardTypeName}} {{option.code}}</div>
            </div>
            <div class="card-type">{{option.member_policy}}</div>
            <div class="section-2 vh-center">
                <lazy-image :src="logoSrc"/>
            </div>
            <div class="section-3 vh-between" v-if="type == 1">
                <div  @click.stop="refreshBalance">
                    <div class="member-balance">
                        <span class="balance">余额： ¥{{option.balance}}</span>
                        <span :class="[refreshStyle]"></span>
                    </div>
                    <div class="useful-life">
                        有效期至{{option.expire_date}}
                    </div>
                </div>
                <i class="icon-qr-code" @click.stop="showQrCode"></i>
            </div>
            <div class="btn-group vh-center" v-if="type == 3 && content.cinemaMode == 3">
                <span v-if="content.bindMobile == 1" class="btn vh-center" v-href="content.href.urlBind" :data-query="'cinema_code='+content.cinemaCode">绑卡</span>
                <span class="btn vh-center" @click="showMobile" v-else>绑卡</span>
            </div>
            <div class="btn-group vh-center" v-if="type == 3 && isSupport('Bind')">
                <span v-if="content.bindMobile == 1" class="btn vh-center" v-href="content.href.urlBind" :data-query="'cinema_code='+content.cinemaCode">绑卡</span>
                <span class="btn vh-center" @click="showMobile" v-else>绑卡</span>
            </div>
        </div>
    </div>
    <div v-else-if="type == 2" class="member-card-gray" >
        <card-message ref="cardMessage"></card-message>
        <div class="title vh-center" v-href="arrPromoUrl">{{ arrPromoTitle }}</div>
        <ad-compass :ad="content.arrPromo" v-if="arrPromoUrl && content.arrPromo['contentID']"/>
        <div class="btn-group vh-center" v-if="content.bindMobile == 1">
            <!-- v-href="content.href.urlBind" :data-query="'ci=' + storedCinema" -->
            <span class="btn vh-center"   @click="openPage(content.href.urlBind)" v-if="isSupport('Bind')">绑卡</span>
            <span class="btn vh-center"   @click="openPage(content.href.urlBind)" v-if="content.cinemaMode == 3">绑卡</span>

            <span class="btn dark vh-center" @click="openPage(content.href.urlMemberpolicy)" v-if="isSupport('Register') "><span class="plus">+</span><span>开卡</span></span>
            <span class="btn dark vh-center" @click="openPage(content.href.urlMemberpolicy)" v-if="content.cinemaMode == 3"><span class="plus">+</span><span>开卡</span></span>
            <!-- v-href="content.href.urlMemberpolicy" :data-query="'ci=' + storedCinema" -->
        </div>
        <div class="btn-group vh-center" v-else>
            <span class="btn vh-center" @click="showMobile" v-if="isSupport('Bind')">绑卡</span>
            <span class="btn vh-center" @click="showMobile" v-if="content.cinemaMode == 3">绑卡</span>
            <span class="btn dark vh-center" @click="showMobile" v-if="isSupport('Register')"><span class="plus">+</span><span>开卡</span></span>
            <span class="btn dark vh-center" @click="showMobile" v-if="content.cinemaMode == 3"><span class="plus">+</span><span>开卡</span></span>
        </div>
    </div>
</template>

<script>
    import {object} from 'common/utils/defaultProps'
    import {bus, get, fire} from 'lib/comp/bus';
    import urlUtil from 'lib/util/URL'
	import openUrl from 'common/utils/openUrl'
    import adCompass from 'common/components/adCompass'
    import cardMessage from "common/components/cardMessage"
    import dialogManager from 'common/plugin/dialog';
    import Pwd from './Pwd.vue'
    import base64 from 'lib/str/base64'

export default {
    props: {
        option: object,
        content: object,
        type: {
            type: Number,
            default: 1
        },
        cardSkin: {
            type: String,
            default: "member-card-3"
        }
    },
    components: {
        adCompass,
        cardMessage
    },
    data() {
        return {
            logoSrcTemp: "/images/common/member-card-logo-#.png",
            storedCinema: "",
            arrPromoTitle: this.content.arrPromo ? this.content.arrPromo[0].title : "开通影城会员卡，最低折扣等你来！",
            arrPromoUrl: this.content.arrPromo ? this.content.arrPromo[0].url : "",
            refresh: false
        }
    },
    computed: {
        logoSrc()　{
            return this.logoSrcTemp.replace(/#/, this.cardSkin.slice(-1));
        },
        refreshStyle() {
            return this.refresh ? "icon-card-refresh loading" : "icon-card-refresh";
        }
    },
    created() {
        this.storedCinema = localStorage.getItem("memberCard.cinema") || "";
    },
    mounted() {
        // this.$refs.cardMessage && fire("cardMessage", this.$refs.cardMessage);
    },
    methods: {
        showMore () {
            this.$emit("show", this.option);
        },
        showQrCode() {
            this.$emit("qrcode", this.option);
        },
        showMobile () {
            fire("mobile");
        },
        isSupport(key) {
            key = key[0].toUpperCase() + key.slice(1);
            const vm = this;
            let mode = vm.content.cinemaMode;
            let support = vm.content.cardConfig;
            return mode != 3 && support["isSupport" + key]
        },
        openPage(url) {
            let vm = this;
            let obj = urlUtil.parse(url);
            if(vm.content.cinemaMode == 3) obj.queryJson.ci = vm.storedCinema;
            url = urlUtil.build(obj);
            openUrl(obj.path, obj.queryJson);
        },
        refreshBalance(){
            let vm = this;
            if(vm.refresh) return;
            dialogManager.open(Pwd, {
                top: "25%",
                tapClose: false,
                url: vm.content.href.urlBalance,
                data: {card_id: this.option.id, card_code: this.option.code},
                ok: this.clickOk,
                buts: [{text: "取消"}, {text: "确定", type: "ok"}],
                afterShow: vm.afterShow
            });                            
        },
        clickOk (res) {
            let vm = this;  
            if(!res.popup.popup.$refs.content.text || !res.popup.popup.$refs.content.text.trim()){
                dialogManager.toast("请输入密码！");
                return;
            }
            vm.refresh = true;
            let password = base64.encode(res.popup.popup.$refs.content.text);
            res.popup.hide();
            vm.$http.get(vm.content.href.urlBalance, {
                params: {
                    card_id: vm.option.id,
                    card_code: vm.option.code,
                    password: password
                }
            }).then((rv) => {                
                vm.refresh = false;
                if(rv.data.balance){
                    vm.option.balance = +rv.data.balance;                
                }                
                dialogManager.toast("余额查询成功!");
            }).catch((rv) => {
                vm.refresh = false;
                dialogManager.toast(rv['msg'] || "查询失败！");
            });
        },
        afterShow(res){
            let vm = this;
            if(res) bus.$emit(get("back"), { cardPop: res});
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.member-card-gray{
    @include wh(546px, 346px);
    @include radius(rem(10px));
    @include display-flex();
    @include flex-direction(column);
    @include justify-content(center);
    .m-card-message {
        padding: 0 rem(32px) rem(50px);
    }
    .title{
        @include font-size(28px);
        padding: 0 rem(32px);
        text-align: center;
        @include line-clamp(2);
        line-height: rem(50px);
    }
    .btn-group{
        padding: rem(32px 32px 0);
        .btn{
            @include box-sizing;
            @include flex(1);
            // @include wh(180px, 72px);
            // min-width: rem(180);
            max-width: rem(360);
            height: rem(72);
            @include radius(rem(72px));
            @include font-size(32px);
            margin: rem(0 16px);
            .plus{
                @include font-size(40px);
                padding-right: rem(10px);
            }
        }
    }
}

.member-card {
    position: relative;
    width: r(546);
    height: r(346);
    @include radius(rem(20px));
    overflow: hidden;
    .btn-group{
        @include left_center;
        bottom: rem(30px);
        z-index: 11;
        .btn{
            @include box-sizing;
            @include wh(180px, 62px);
            @include radius(rem(72px));
            @include font-size(32px);
        }
    }
    .overlay{
        @include wh(546px, 346px);
        position: absolute;
        z-index: 10;
        left: 0;
        top: 0;
    }
    .container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    &.member-card-1{
        .section-2 {
            @include height(142px);
        }
    }
    &.member-card-2{
        .section-2 {
            @include height(160px);
        }
    }
    &.member-card-3{
        .section-2 {
            @include height(172px);
        }
    }
    &.member-card-4{
        .section-2 {
            @include height(154px);
        }
    }
    &.member-card-5{
        .section-2 {
            @include height(177px);
        }
    }
    .section-1 {
        padding: rem(24px 22px 0);
        .row-1 {
            @extend %ellipsis-basic;
            @include flex(1);
            @include font-size(22px);
        }
        .row-2 {
            padding: 0;
            font-size: r(20);
        }
    }
    .card-type{
        @include font-size(28px);
        padding: rem(12px 0 0 22px);
    }

    .section-2 {
        @include left_center;
        top: rem(65px);
        >img {
            height: 100%;
        }
    }

    .section-3{
        @include wh(100%, 94px);
        background-color: rgba(255, 255, 255, 0.1);
        position: absolute;
        left: 0;
        bottom: 0;
        @include box-sizing;
        padding: rem(0 22px);
        .member-balance{
            @include font-size(28px);
            .icon-card-refresh{
                margin-left: rem(12px);
                margin-bottom: rem(-3px);
                &.loading{
                    @include animation(loading .4s ease 0s infinite);
                }
            }
        }
        .useful-life{
            @include font-size(20px);
            padding-top: rem(10px);
        }
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
    @include keyframes(loading){
        0%{
            @include rotate(0deg);
        }
        25% {
          @include rotate(90deg);
        }
        50% {
          @include rotate(180deg);
        }
        75% {
          @include rotate(270deg);
        }
        100% {
            @include rotate(360deg);
        }
    }
}
</style>
