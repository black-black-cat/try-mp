<template>
    <div class="m-count">
        <ul class="m-index-tab fixed-top" v-if="show">
            <li class="item selected">正在热映</li>
            <li class="item" v-href="options.href.urlNew" data-target="self">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>
        <div class="scrolling">
            <app-header :images="options.bannerImage" :cinema="options.data.cinema" :href="options.href" :options="options" :is-login="options.data.is_login" ></app-header>
            <app-content :options="options" @showBindMobile="showBindMobile" ref="content"></app-content>
        </div>

        <template v-if="options.data.isSelectCinema == 2">
            <div class="tap-cinema vh-center" @click="showSelectCinema"><i class="icon-cinema"></i></div>
            <select-cinema :iphone-x="iphoneX" :url="options.href.apiCinemalist" :callback-url="options.data.callbackUrl" :show.sync="isShowSelectCinema" />
        </template>

        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" selected="true" name="推荐"></app-item>
            <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
            <app-item icon="me" :href="options.bottomNavItems[3]" name="我的" :is-login="options.data.is_login" :ajax-url="options.href" ></app-item>
        </app-nav-items>

        <popup-ad
            :adData="adData"
            :apiCode="apiCode"
            :apiActi="apiActi"
            :apiBind="apiBind"
            :boundMobile.sync="options.data.bindMobile"
            v-if="adData && adData.img"
            :ajax-url="options.href"
            :is-login="options.data.is_login"
        ></popup-ad>

        <bind-mobile
            :show.sync="isBindMobileShow"
            :subUrl="apiBind"
            :url="apiCode"
            @onBindSuccess="bindMobileSuccess"
        ></bind-mobile>
    </div>
</template>

<script>
import appHeader from './Header.vue'
import appContent from './Content.vue'
import viewport from 'lib/comp/viewport'
import {bind, fire} from 'lib/comp/bus'

export default {
    props: ["options", "proxy"],
    components: {
        appHeader,
        appContent
    },
    data () {
        return {
            image: this.options.bannerImage && this.options.bannerImage.length > 0,
            show: false,
            height: 312,
            cardConfig: this.options.data.cinemaCardConf || [],
            apiCode: this.options.href.apiSendsmsmobile,
            apiBind: this.options.href.apiBindmobile,
            apiActi: this.options.href.urlActview,
            isBindMobileShow: false,
            isLogin: this.options.data.is_login,
            iphoneX: "selectCinema",
            isShowSelectCinema: false
        }
    },
    computed: {
        adData(){
            if (this.options.popup) {
                return this.options.popup[0]
            }
        },
        // height() {
        //     return this.image ? 312 : 84;
        // }
    },
    mounted () {
        this.image && window.addEventListener("scroll", this.scroll);
        this.height = this.image ? viewport.rem() / 75 * this.height : viewport.rem() / 75 * 84;
        this.show = !this.image;
        bind("showPrice", this.onShowPrice.bind(this));
    },
    methods: {
        scroll () {
            const y = window.scrollY;
            this.show = y > this.height;
            const fixedSwiper = this.getFixedSwiperEl();

            fire("scroll.fix", {top: y, height: fixedSwiper ? fixedSwiper.offsetHeight : this.height, isFixed: this.show});
        },
        getFixedSwiperEl () {
            let small = document.querySelector(".m-swiper-fix .show-swipe");
            return small;
            // let big = document.querySelector(".m-swiper");
            // return big;
        },
        onShowPrice() {
            fire("setCardConfig", this.cardConfig);
        },
        bindMobileSuccess() {
            this.options.data.bindMobile = 1;
        },
        showBindMobile() {
            this.isBindMobileShow = true;
        },
        showSelectCinema() {
            this.isShowSelectCinema = true;
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
    .scrolling{
        position: relative;
    }
    .m-index-tab{
        @include display-flex;
        @include justify-content(space-around);
        @include align-items(center);
        @include height(80px);
        padding: rem(0 20px);
        width: 100%;
        @include box-sizing;
        position: relative;
        z-index: 12;
        &.fixed-top{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 13;
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
