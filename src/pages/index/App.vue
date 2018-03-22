<template>
    <div class="m-count">
        <ul class="m-index-tab fixed-top" v-if="show">
            <li class="item selected">正在热映</li>
            <li class="item" v-href="options.href.urlNew" data-target="self">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>
        <div class="scrolling">
            <app-header :images="options.bannerImage ||[]" :apiActi="apiActi" :apiCode="apiCode" :apiBind="apiBind" :boundMobile.sync="boundMobile" :ajax-url="options.href" :is-login="options.data.is_login"></app-header>
            <app-content :href="options.href" :image="image" :app-info="appInfo"></app-content>
            <popup-ad :adData="adData" :apiCode="apiCode" :apiActi="apiActi" :apiBind="apiBind" :boundMobile.sync="boundMobile" v-if="adData && adData.img" :ajax-url="options.href" :is-login="options.data.is_login"></popup-ad>
        </div>

        <template v-if="options.data.isSelectCinema == 2">
            <div class="tap-cinema vh-center" @click="showSelectCinema"><i class="icon-cinema"></i></div>
            <select-cinema :iphone-x="iphoneX" :url="options.href.apiCinemalist" :callback-url="options.data.callbackUrl" :show.sync="isShowSelectCinema" />
        </template>

        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" selected="true" name="推荐"></app-item>
            <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
            <app-item icon="me" :href="options.bottomNavItems[3]" :is-login="options.data.is_login" :ajax-url="options.href" name="我的"></app-item>
        </app-nav-items>

    </div>
</template>

<script>
import appHeader from 'common/components/promotionSlides'
import dialogManager from 'common/plugin/dialog'
import appContent from './Content.vue'
import viewport from 'lib/comp/viewport'
import {bus, get} from 'lib/comp/bus';
export default {
    props: ["options", "proxy"],
    components: {
        appHeader,
        appContent,
    },
    data () {
        return {
            image: this.options.bannerImage && this.options.bannerImage.length > 0,
            apiActi: this.options.href.urlActview,
            apiBind: this.options.href.apiBindmobile,
            apiCode: this.options.href.apiSendsmsmobile,
            show: false,
            height: viewport.rem() / 75 * 312,
            boundMobile: this.options.data.bindMobile,
            wxFlag: false,
            isLogin:this.options.data.is_login,
            callbackData:null,
            appInfo: JSON.parse(this.options.data.appInfo || '{}'),
            iphoneX:"selectCinema",
            isShowSelectCinema: false
        }
    },
    computed: {
        adData(){
            if (this.options.popupImage) {
                return this.options.popupImage[0]
            }
            if (this.options.popup) {
                return this.options.popup[0]
            } else {
                return this.options.bannerImage && this.options.bannerImage.popup && this.options.bannerImage.popup[0]
            }
        }
    },
    mounted () {
        let vm = this;
        this.image && window.addEventListener("scroll", this.scroll);
        this.show = !this.image;
    },
    methods: {
        scroll () {
            this.show = window.scrollY > this.height;
        },
        showSelectCinema() {
            this.isShowSelectCinema = true;
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
    .m-views-index{
        min-height: 100vh;
    }
    .m-index-tab{
        @include display-flex(flex);
        @include justify-content(space-around);
        @include align-items(center);
        @include height(80px);
        padding: rem(0 20px);
        width: 100%;
        @include box-sizing;
        &.fixed-top{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 12;
            @include height(100px);
            padding: rem(20px 20px 0);
        }
        .item{
            @include font-size(28px);
            width: 100%;
            text-align: center;
            .arrow-right{
                @include arrow-right;
                margin: rem(0 -10px 0 10px);
            }
        }
        .selected{
            position: relative;
            &:before{
                content: "";
                position: absolute;
                @include wh(54px, 4px);
                bottom: rem(-24px);
                left: 50%;
                margin-left: rem(-27px);
            }
        }
    }
    .tap-cinema {
        position: fixed;
		z-index: 13;
		top: rem(24px);
		right: rem(20px);
		@include wh(62px);
		@include radius(rem(62px));
    }
</style>
